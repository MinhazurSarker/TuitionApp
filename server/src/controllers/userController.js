const User = require('./../models/User');
const Post = require('./../models/Post');
const OTPModel = require('./../models/OTP');
const Rating = require('../models/Rating');

//-------------------------------
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const axios = require("axios").default;
const otpGenerator = require('otp-generator');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const request = require('request');
//---------------
var jsonDB = new JsonDB(new Config("settingsData", true, false, '/'));
var dashboardDB = new JsonDB(new Config("dashboardData", true, false, '/'));
const moment = require('moment');
const fs = require('fs')
const appRoot = require('app-root-path');
const Report = require('../models/Report');


const smsAPIToken = jsonDB.getData("/sms/smsToken");
const smsGateway = jsonDB.getData("/sms/smsGateway");

//-------------------------------
dotenv.config();
//-------------------------------
const jwt_secret = process.env.JWT_SECRET;

//-------------------------------
const sendOTP = async (req, res) => {
    const phone = req.body.phone;
    if (phone.length == 13) {
        const OTP = otpGenerator.generate(6, {
            digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
        });
        if (smsAPIToken.length !== 0) {
            if (smsGateway == 'alphaSMS') {
                var options = {
                    'method': 'POST',
                    'url': 'https://api.sms.net.bd/sendsms',
                    formData: {
                        'api_key': smsAPIToken,
                        'msg': `Your TuitionApp OTP Code is ${OTP} , Do not share to anybody`,
                        'to': `${phone}`
                    }
                };
                await request(options, function (error, response) {
                    if (error) throw new Error(error);
                    console.log(response.body);
                });

            } else if (smsGateway == 'greenWeb') {

                const greenwebsms = new URLSearchParams();
                greenwebsms.append('token', smsAPIToken);
                greenwebsms.append('to', `+${phone}`);
                greenwebsms.append('message', `Your TuitionApp OTP Code is ${OTP} , Do not share to anybody`);
                await axios.post('http://api.greenweb.com.bd/api.php', greenwebsms).then(response => {
                });
            }
        } else {
            console.log(OTP);
        }
        const refUser = req.query.ref
        const hashOTP = await bcrypt.hash(OTP, 10);
        const otp = new OTPModel({ phone: phone, otp: hashOTP });
        await otp.save();
        return res.status(200).send({ msg: "We\'ve sent an OTP to your phone number.Please provide it bellow", ref: refUser });
    } else {
        return res.status(400).send({ msg: "Send an valid phone number (must include 88)" });
    }

}

//-------------------------------
const LoginOrCreateUser = async (req, res) => {
    let reqPhone = req.body.phone;
    let reqOTP = req.body.otp;
    const totalLogin = dashboardDB.getData("/login");
    const totalReg = dashboardDB.getData("/reg");
    if (reqPhone && reqOTP) {
        try {
            const otpHolder = await OTPModel.find({ phone: reqPhone });
            if (otpHolder.length === 0) {
                return res.status(400).send("You use an Expired OTP!");
            } else {
                const rightOtpFind = otpHolder[otpHolder.length - 1];
                const validOTP = await bcrypt.compare(reqOTP, rightOtpFind.otp);
                const user = await User.findOne({ phone: reqPhone });
                if (user && rightOtpFind.phone === req.body.phone && validOTP) {
                    const payload = {
                        userId: user._id
                    }
                    try {
                        dashboardDB.push('/login', Number(totalLogin) + 1);
                    } catch { }
                    const token = jwt.sign(payload, jwt_secret, { expiresIn: 60 * 60 * 24 * 30 });
                    await OTPModel.deleteMany({ phone: rightOtpFind.phone });
                    res.status(200).json({ authType: "login", token: token, user: user })
                } else if (rightOtpFind.phone === req.body.phone && validOTP) {
                    const newUser = new User({ phone: reqPhone, refs: 0, role: 'user' })
                    await newUser.save();
                    const payload = {
                        userId: newUser._id
                    }
                    const token = jwt.sign(payload, jwt_secret, { expiresIn: 60 * 60 * 24 * 30 });
                    await OTPModel.deleteMany({ phone: rightOtpFind.phone });
                    try {
                        dashboardDB.push('/reg', Number(totalReg) + 1);
                    } catch { }
                    try {
                        const refUser = await User.findOne({ _id: req.query.ref });
                        refUser.refs = Number(refUser.refs) + 1;
                        refUser.save();
                    } catch { }
                    res.status(200).json({ authType: "registration", token: token, user: newUser })
                } else {
                    res.status(200).send({ msg: "You use an Expired OTP!" });
                }
            }
        } catch (error) {
            return res.status(200).send({ msg: "You use an Expired OTP!" });

        }
    } else {
        res.status(200).send({ msg: "You didn\'t send valid data" });
    }
}
//-------------------------------
const updateUser = async (req, res) => {
    let user;
    try {
        user = await User.findOne({ _id: req.params.userId },)
    } catch { res.status(400).send({ msg: 'Not found' }) }
    let avatarImgPath = user.avatarImg;
    let coverImgPath = user.coverImg;
    if (req.files.avater !== undefined) {
        if (user.avatarImg.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + user.avatarImg.replace('public', '').split('/').join('\\'), (err) => { });
        }
        avatarImgPath = req.files.avater[0].path.replace('public', '').split('\\').join('/');
    }
    if (req.files.cover !== undefined) {
        if (user.coverImg.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + user.coverImg.replace('public', '').split('/').join('\\'), (err) => { });
        }
        coverImgPath = req.files.cover[0].path.replace('public', '').split('\\').join('/');
    }

    user.name = req.body.name;
    user.age = req.body.age;
    user.email = req.body.email;
    user.gender = req.body.gender;
    user.bio = req.body.bio;
    user.divission = req.body.divission;
    user.district = req.body.district;
    user.upozilla = req.body.upozilla;
    user.union = req.body.union;
    user.subjects = req.body.subjects;
    user.class = req.body.class;
    user.institute = req.body.institute;
    user.department = req.body.department;
    user.days = req.body.days;
    user.education = JSON.parse(req.body.education);
    user.avatarImg = avatarImgPath;
    user.coverImg = coverImgPath;
    await user.save()
    res.status(200).send({ user: user })
}

//-------------------------------
const getTutors = async (req, res) => {
    const { div, dis, upo, uni, search } = req.query
    const searchString = search.toString()
    const Model = User;
    let data
    if (div.length !== 0 && dis.length !== 0 && upo.length !== 0 && uni.length !== 0) {
        data = await Model.find({
            role: 'tutor',
            divission: div,
            district: dis,
            upozilla: upo,
            union: uni,
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (div.length !== 0 && dis.length !== 0 && upo.length !== 0) {
        data = await Model.find({
            role: 'tutor',
            divission: div,
            district: dis,
            upozilla: upo,
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (div.length !== 0 && dis.length !== 0) {
        data = await Model.find({
            role: 'tutor',
            divission: div,
            district: dis,
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (div.length !== 0) {
        data = await Model.find({
            role: 'tutor',
            divission: div,
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else {
        data = await Model.find({
            role: 'tutor',
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });

    }

    const page = parseInt(req.query.page) || 1;
    const pages = (data.length / 20 | 0) + 1;
    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;
    if (data) {
        res.status(200).send({
            data: data.reverse().slice(startIndex, endIndex) || "No data found",
            lastPage: endIndex >= data.length ? true : false,
            pages: pages,
            current: page
        });
    } else {
        res.status(400).send({ data: "No data found" });
    }
}
const getTutorsMyLoc = async (req, res) => {
    const user = await User.findOne({ _id: req.body.userId })
    const searchString = req.query.search.toString()
    const Model = User;
    let data
    if (user.divission.length !== 0 && user.district.length !== 0 && user.upozilla.length !== 0 && user.union.length !== 0) {
        data = await Model.find({
            role: 'tutor',
            divission: user.divission,
            district: user.district,
            upozilla: user.upozilla,
            union: user.union,
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (user.divission.length !== 0 && user.district.length !== 0 && user.upozilla.length !== 0) {
        data = await Model.find({
            role: 'tutor',
            divission: user.divission,
            district: user.district,
            upozilla: user.upozilla,
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (user.divission.length !== 0 && user.district.length !== 0) {
        data = await Model.find({
            role: 'tutor',
            divission: user.divission,
            district: user.district,
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (user.divission.length !== 0) {
        data = await Model.find({
            role: 'tutor',
            divission: user.divission,
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else {
        data = await Model.find({
            role: 'tutor',
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });

    }

    const page = parseInt(req.query.page) || 1;
    const pages = (data.length / 20 | 0) + 1;
    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;
    if (data) {
        res.status(200).send({
            data: data.slice(startIndex, endIndex) || "No data found",
            lastPage: endIndex >= data.length ? true : false,
            pages: pages,
            current: page
        });
    } else {
        res.status(400).send({ data: "No data found" });
    }
}

//-------------------------------

const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId, });
        const ratings = await Rating.find({ to: user._id }).populate('postedBy', 'avatarImg _id name gender')
        const page = parseInt(req.query.page) || 1;
        const startIndex = (page - 1) * 20;
        const endIndex = page * 20;
        const reqUserRole = req.body.role

        const posts = await Post.find({ userID: user._id });
        const pages = ((posts.length / 20) | 0) + 1;

        if (user.role == 'user') {
            const resData = {
                _id: user._id,
                name: user.name,
                phone: reqUserRole == 'tutor' ? user.phone : null,
                age: user.age,
                gender: user.gender,
                bio: user.bio,
                institute: user.institute,
                department: user.department,
                followers: user.followers.length,
                posts: posts.slice(startIndex, endIndex),
                lastPage: endIndex >= posts.length ? true : false,
                ratings: ratings,
                avatarImg: user.avatarImg,
                coverImg: user.coverImg,
            }
            res.status(200).json(resData);
        } else if (user.role == 'tutor') {
            const resData = {
                _id: user._id,
                avatarImg: user.avatarImg,
                coverImg: user.coverImg,
                phone: (reqUserRole == 'tutor' || reqUserRole == 'super' || reqUserRole == 'admin') ? user.phone : null,
                role: user.role,
                email: user.email,
                name: user.name,
                age: user.age,
                gender: user.gender,
                bio: user.bio,
                divission: user.divission,
                district: user.district,
                upozilla: user.upozilla,
                union: user.union,
                subjects: user.subjects,
                class: user.class,
                institute: user.institute,
                department: user.department,
                days: user.days,
                followers: user.followers.length,
                education: user.education,
                ratings: ratings.reverse().slice(0, 20),
                posts: posts.reverse().slice(startIndex, endIndex),
                lastPage: endIndex >= posts.length ? true : false,
                pages: pages
            }
            res.status(200).json(resData);
        } else {
            res.status(400).json("No tutor found");
        }
    } catch (error) {
        res.status(400).json("No tutor found");
    }

}

//-------------------------------
const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.userId });
        await Post.deleteMany({ userID: req.params.userId })
        res.status(200).send({ msg: 'success' });
    } catch (error) {
        res.status(400).send({ err: 'error' });
    }
}
//------------------------------
const phoneUpdateVerify = async (req, res) => {
    let reqPhone = req.body.phone;
    let reqOTP = req.body.otp;
    if (reqPhone && reqOTP) {
        const otpHolder = await OTPModel.find({ phone: reqPhone });
        if (otpHolder.length === 0) {
            return res.status(400).send("You use an Expired OTP!");
        } else {
            const rightOtpFind = otpHolder[otpHolder.length - 1];
            const validOTP = await bcrypt.compare(reqOTP, rightOtpFind.otp);
            if (rightOtpFind.phone === reqPhone && validOTP) {
                const user = await User.findOneAndUpdate({ _id: req.body.userId }, { phone: reqPhone });
                await user.save();
                await OTPModel.deleteMany({ phone: rightOtpFind.phone });
                res.status(200).json({ msg: "Phone number updated successful" })
            } else {
                res.status(400).send("You use an Expired OTP!");
            }
        }
    } else {
        res.status(400).send("You didn\'t send valid data");
    }
}

const userFollow = async (req, res) => {
    try {
        const user = await User.findById(req.body.followId);
        const currentUser = await User.findById(req.body.userId);
        if (currentUser._id.toString() !== user._id.toString()) {
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: currentUser._id.toString() } });
                await currentUser.updateOne({ $push: { followings: user._id.toString() } });
                res.status(200).json({ type: 'Followed', msg: "user has been followed" });
            } else {
                await user.updateOne({ $pull: { followers: currentUser._id.toString() } });
                await currentUser.updateOne({ $pull: { followings: user._id.toString() } });
                res.status(200).json({ type: 'Unfollowed', msg: "user has been Unfollowed" });
            }
        } else {
            res.status(403).json({ msg: "you cant follow yourself" });
        }
    } catch (err) {

        res.status(500).json(err);
    }
}
const followingUsers = async (req, res) => {
    const searchString = req.query.search.toString()
    try {
        const users = await User.find({
            followers: { $in: req.body.userId.toString() },
            role: 'tutor',
            $or: [
                { name: { $regex: searchString, $options: 'i' } },
                { institute: { $regex: searchString, $options: 'i' } },
                { department: { $regex: searchString, $options: 'i' } }
            ],
        });
        const page = parseInt(req.query.page) || 1;
        const pages = (users.length / 20 | 0) + 1;
        const startIndex = (page - 1) * 20;
        const endIndex = page * 20;
        res.status(200).send({
            data: users.reverse().slice(startIndex, endIndex) || "No data found",
            lastPage: endIndex >= users.length ? true : false,
            pages: pages,
            current: page
        });
    } catch (err) {
        res.status(500).json(err);
    }
}
const upgradeByRefs = async (req, res) => {
    const totalUp = dashboardDB.getData("/upgrade");

    try {
        const expDate = moment(Date.now()).add(30, 'days').format('YYYY-MM-DD');
        const user = await User.findOne({ _id: req.body.userId });
        if (user.refs >= 3) {
            user.role = 'tutor';
            user.refs = Number(user.refs) - 3
            user.subEnd = expDate;
            user.save()
            dashboardDB.push('/upgrade', Number(totalUp) + 1);
            res.status(200).json({ msg: 'success' })
        } else {
            res.status(200).json({ msg: 'failled' })
        }
    } catch {
        res.status(500).json({ msg: 'Something went wrong' })

    }
}
const userRate = async (req, res) => {
    try {
        const rating = await Rating.findOne({ to: req.params.userId, postedBy: req.body.userId })
        rating.stars = req.body.stars
        rating.desc = req.body.desc
        rating.save();
        res.status(200).json({ msg: 'User rating updated successfully' })
    } catch {
        const rating = await new Rating({ to: req.params.userId, postedBy: req.body.userId, stars: req.body.stars, desc: req.body.desc })
        rating.save();
        res.status(200).json({ msg: 'User rated successfully' })
    }
}

//-----Profile data
const getMyProfileData = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        const posts = await Post.find({ userID: user._id });
        const ratings = await Rating.find({ to: user._id }).select('stars')
        const resData = {
            _id: user._id,
            phone: user.phone,
            role: user.role,
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender,
            bio: user.bio,
            divission: user.divission,
            district: user.district,
            upozilla: user.upozilla,
            union: user.union,
            subjects: user.subjects,
            class: user.class,
            institute: user.institute,
            department: user.department,
            days: user.days,
            followers: user.followers.length,
            education: user.education,
            avatarImg: user.avatarImg,
            coverImg: user.coverImg,
            refs: user.refs,
            posts: posts,
            ratings: ratings,
        }
        res.status(200).json({ user: resData })
    } catch {
        res.status(200).json({ mag: 'not found' })
    }
}
const reportUser = async (req, res) => {
    try {
        const report = await new Report({
            by: req.body.userId,
            reported: req.params.userId,
            type: 'user',
            reason: req.body.reason,
            desc: req.body.desc,
        });
        report.save()
        res.status(200).json({ msg: "Reported successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", });
    }
}
//-------------------------------
module.exports = {
    getUser,
    sendOTP,
    LoginOrCreateUser,
    updateUser,
    deleteUser,
    getTutors,
    getTutorsMyLoc,
    phoneUpdateVerify,
    userFollow,
    upgradeByRefs,
    userRate,
    followingUsers,
    getMyProfileData,
    reportUser
};