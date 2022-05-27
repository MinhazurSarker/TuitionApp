const User = require('./../models/User');
const Post = require('./../models/Post');
const Plan = require('./../models/Plan');
const TRX = require('./../models/TRX');
const Book = require('./../models/Book');
const OTPModel = require('./../models/OTP');
const Slider = require('./../models/Slider');
//---------------

const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const axios = require("axios").default;
const otpGenerator = require('otp-generator');
const request = require('request');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const moment = require('moment');
const fs = require('fs')
const appRoot = require('app-root-path');
const Report = require('../models/Report');
const Contact = require('../models/Contact');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
//---------------
const jsonDB = new JsonDB(new Config("settingsData", true, false, '/'));
const policiesDB = new JsonDB(new Config("policiesData", true, false, '/'));
const dashboardDB = new JsonDB(new Config("dashboardData", true, false, '/'));

const divissionDB = new JsonDB(new Config("divissions", true, false, '/'));
const districtDB = new JsonDB(new Config("districts", true, false, '/'));
const upozillaDB = new JsonDB(new Config("upazillas", true, false, '/'));
const unionDB = new JsonDB(new Config("unions", true, false, '/'));

const totalLogin = dashboardDB.getData("/login");
const totalReg = dashboardDB.getData("/reg");
const totalUp = dashboardDB.getData("/upgrade");
const totalIncome = dashboardDB.getData("/income");

dotenv.config();


const jwt_secret = process.env.JWT_SECRET;

const smsAPIToken = jsonDB.getData("/sms/smsToken");
const smsGateway = jsonDB.getData("/sms/smsGateway");


//---------------
const sendOTP = async (req, res) => {
    const phone = req.body.phone;
    if (phone.length == 13) {
        try {
            const user = await User.findOne({ phone: req.body.phone })
            if (user && (user.role == 'admin' || user.role == 'super')) {
                const OTP = otpGenerator.generate(6, {
                    digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
                });
                if (smsAPIToken) {
                    if (smsGateway == 'alphaSMS') {
                        const options = {
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
                        axios.post('http://api.greenweb.com.bd/api.php', greenwebsms).then(response => {
                            console.log(response.data);
                        });
                    }
                } else {
                    console.log(OTP);
                }
                const hashOTP = await bcrypt.hash(OTP, 10);
                const otp = new OTPModel({ phone: phone, otp: hashOTP });
                await otp.save();
                return res.status(200).render('verify', { msg: '', phone: phone });
            } else {
                return res.status(200).render('login', { msg: 'You are not an Admin' });
            }

        } catch (err) {
            return res.status(200).render('login', { msg: err });
        }
    } else {
        return res.status(200).render('login', { msg: 'Invalid phone number' });
    }
}
//--------------
const OTPverify = async (req, res) => {
    let reqPhone = req.body.phone;
    let reqOTP = req.body.otp;
    if (reqPhone && reqOTP) {
        const otpHolder = await OTPModel.find({ phone: reqPhone });
        if (otpHolder.length === 0) {
            res.status(406).redirect('/login?msg=Expired');
        } else {
            const rightOtpFind = otpHolder[otpHolder.length - 1];
            const validOTP = await bcrypt.compare(reqOTP, rightOtpFind.otp);
            const user = await User.findOne({ phone: reqPhone });
            if (user && rightOtpFind.phone === req.body.phone && validOTP) {
                const payload = {
                    userId: user._id
                }
                const token = jwt.sign(payload, jwt_secret, { expiresIn: 60 * 60 * 24 * 30 });
                await OTPModel.deleteMany({ phone: rightOtpFind.phone });
                res.cookie('token', token, {
                    httpOnly: true,
                    // secure: true 
                });
                res.status(200).redirect(`/`);

            } else {
                res.status(406).redirect('/login?msg=Expired');
            }
        }
    } else {
        return res.status(200).render('verify', { msg: "Invalid", phone: reqPhone });
    }
}

// get req-----------
const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
}
// Post & delete req-----------
// Post & delete req-----------
// Post & delete req-----------
const smsSettongs = (req, res) => {
    jsonDB.push('/sms', { smsToken: req.body.smsToken, smsGateway: req.body.smsGateway });
    res.redirect('back');
}
const paySettings = (req, res) => {
    jsonDB.push('/payKeys', { signKey: req.body.signKey, storeId: req.body.storeId, returnUrl: req.body.returnUrl, mode: req.body.mode });
    res.redirect('back');
}
const footerLinkSettings = (req, res) => {
    jsonDB.push('/footerLinks', {
        txt: req.body.txt,
        fb: req.body.fb,
        in: req.body.in,
        tw: req.body.tw,
        yt: req.body.yt,
        phone: req.body.phone,
        ps: req.body.ps,
        as: req.body.as,
    });
    res.redirect('back');
}
const setTerms = (req, res) => {
    policiesDB.push('/terms', req.body.terms);
    res.redirect('back');
}
const setPolicies = (req, res) => {
    policiesDB.push('/policies', req.body.policies);
    res.redirect('back');
}
const setDisclaimers = (req, res) => {
    policiesDB.push('/disclaimers', req.body.disclaimers);
    res.redirect('back');
}
const setAbout = (req, res) => {
    policiesDB.push('/about', req.body.about);
    res.redirect('back');
}
const newSlider = async (req, res) => {
    const newSlider = await new Slider({});
    await newSlider.save();
    res.redirect('back')
}
const updateSlider = async (req, res) => {
    const sliderId = req.params.sliderId;
    let slider;
    try {
        slider = await Slider.findOne({ _id: sliderId },)
    } catch (error) { res.send(error) }
    let imgPath = slider.img;
    if (req.file !== undefined) {
        if (slider.img.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + slider.img.replace('public', '').split('/').join('\\'), (err) => { });
        }
        imgPath = req.file.path.replace('public', '').split('\\').join('/');
    }
    slider.title = req.body.title;
    slider.heading = req.body.heading;
    slider.text = req.body.text;
    slider.btn = req.body.btn;
    slider.url = req.body.url;
    slider.img = imgPath;
    slider.save()
    res.redirect('back')


}
const deleteSlider = async (req, res) => {
    const sliderId = req.params.sliderId;
    try {
        const slider = await Slider.findOne({ _id: sliderId });
        if (slider.img.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + slider.img.replace('public', '').split('/').join('\\'), (err) => { });
        }
        await Slider.findOneAndDelete({ _id: sliderId });
        res.redirect('back')
    } catch (error) {
        res.render('404')
    }
}

const newContact = async (req, res) => {
    try {
        const contact = new Contact({
            name: req.body.name,
            company: req.body.company,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject,
            desc: req.body.desc,
            lan: req.body.lan,
            lon: req.body.lon,
        });
        contact.save();
        res.status(200).json({ msg: 'success' })
    } catch (error) {
        res.status(400).json({ msg: 'error' })
    }

}
const createDivission = async (req, res) => {
    const divissions = divissionDB.getData("/divissions");
    divissions.push({ name: req.body.name })
    divissionDB.push('/divissions', divissions);
    res.redirect('back');
}
const createDistrict = async (req, res) => {
    const districts = districtDB.getData("/districts");
    districts.push({ divission: req.body.divission, name: req.body.name })
    districtDB.push('/districts', districts);
    res.redirect('back');
}
const createUpozilla = async (req, res) => {
    const upazillas = upozillaDB.getData("/upazillas");
    upazillas.push({ district: req.body.district, name: req.body.name })
    upozillaDB.push('/upazillas', upazillas);
    res.redirect('back');
}
const createUnion = async (req, res) => {
    const unions = unionDB.getData("/unions");
    unions.push({ upazilla: req.body.upozilla, name: req.body.name })
    unionDB.push('/unions', unions);
    res.redirect('back');
}

const createPlan = async (req, res) => {

    const newPlan = await new Plan(
        {
            userID: req.body.userId,
            title: req.body.title,
            days: req.body.days,
            amount: req.body.amount,
            desc: req.body.desc
        }
    );
    await newPlan.save();
    res.redirect(`/plan/${newPlan._id}`)
}
const createPost = async (req, res) => {
    const newPost = await new Post(
        {
            userID: req.body.userId,
            class: req.body.class,
            days: req.body.days,
            lang: req.body.lang,
            salary: req.body.salary,
            subjects: req.body.subjects,
            divission: req.body.divission,
            district: req.body.district,
            upozilla: req.body.upozilla,
            union: req.body.union,
            lan: req.body.lan,
            desc: req.body.desc,
            lon: req.body.lon
        });
    await newPost.save();
    res.redirect(`/post/${newPost._id}`)
}
const createBook = async (req, res) => {
    let imgPath = '';
    let pdfPath = '';
    if (req.files.img !== undefined) { imgPath = req.files.img[0].path.replace('public', '').split('\\').join('/'); }
    if (req.files.pdf !== undefined) { pdfPath = req.files.pdf[0].path.replace('public', '').split('\\').join('/'); }
    try {
        const user = await User.findOne({ _id: req.body.userId })
        const newBook = await new Book(
            {
                userID: user._id,
                title: req.body.title,
                author: user.name,
                role: user.role,
                desc: req.body.desc,
                img: imgPath,
                pdf: pdfPath
            });
        await newBook.save();
        res.redirect(`/book/${newBook._id}`)
    } catch (error) {
        res.render('login')
    }
}
const createUser = async (req, res) => {
    let avatarImgPath = '';
    let coverImgPath = '';
    if (req.files.avater !== undefined) { avatarImgPath = req.files.avater[0].path.replace('public', '').split('\\').join('/'); }
    if (req.files.cover !== undefined) { coverImgPath = req.files.cover[0].path.replace('public', '').split('\\').join('/'); }
    const subEnd = moment(req.body.subEnd).format('YYYY-MM-DD');
    const newUser = await new User(
        {
            phone: req.body.phone,
            role: req.body.userRole,
            email: req.body.email,
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            bio: req.body.bio,
            divission: req.body.divission,
            district: req.body.district,
            upozilla: req.body.upozilla,
            union: req.body.union,
            subjects: req.body.subjects,
            class: req.body.class,
            institute: req.body.institute,
            department: req.body.department,
            days: req.body.days,
            subEnd: subEnd,
            refs: req.body.refs,
            avatarImg: avatarImgPath,
            coverImg: coverImgPath,
        });
    await newUser.save();
    res.redirect(`/user/${newUser._id}`)
}

const editPlan = async (req, res) => {
    const planId = req.params.planId;
    try {
        await Plan.findOneAndUpdate(
            { _id: planId },
            {
                title: req.body.title,
                days: req.body.days,
                amount: req.body.amount,
                desc: req.body.desc
            });
        res.redirect('back')
    } catch (error) {
        res.render('404')
    }
}
const editPost = async (req, res) => {
    const postId = req.params.postId;
    try {
        await Post.findOneAndUpdate(
            { _id: postId },
            {
                class: req.body.class,
                days: req.body.days,
                lang: req.body.lang,
                subjects: req.body.subjects,
                divission: req.body.divission,
                district: req.body.district,
                upozilla: req.body.upozilla,
                union: req.body.union,
                lan: req.body.lan,
                desc: req.body.desc,
                lon: req.body.lon
            });
        res.redirect('back')
    } catch (error) {
        res.render('404')
    }
}
const editBook = async (req, res) => {
    let book;
    try {
        book = await Book.findOne({ _id: req.params.bookId },)
    } catch (error) { res.send(error) }
    let imgPath = book.img;
    let pdfPath = book.pdf;

    if (req.files.img !== undefined) {
        if (book.img.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + book.img.replace('public', '').split('/').join('\\'), (err) => { });
        }
        imgPath = req.files.img[0].path.replace('public', '').split('\\').join('/');
    }
    if (req.files.pdf !== undefined) {
        if (book.pdf.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + book.pdf.replace('public', '').split('/').join('\\'), (err) => { });
        }
        pdfPath = req.files.pdf[0].path.replace('public', '').split('\\').join('/');
    }
    book.title = req.body.title;
    book.desc = req.body.desc;
    book.img = imgPath;
    book.pdf = pdfPath;
    await book.save()
    res.redirect(`/book/${book._id}`)
}
const editProfile = async (req, res) => {
    let user;
    try {
        user = await User.findOne({ _id: req.params.userId },)
    } catch (error) { res.send(error) }
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
    user.phone = req.body.phone;
    user.email = req.body.email;
    user.name = req.body.name;
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.bio = req.body.bio;
    user.divission = req.body.divission;
    user.district = req.body.district;
    user.upozilla = req.body.upozilla;
    user.union = req.body.union;
    user.subjects = req.body.subjects;
    user.class = req.body.class;
    user.institute = req.body.institute;
    user.days = req.body.days;
    user.avatarImg = avatarImgPath;
    user.coverImg = coverImgPath;
    await user.save()
    res.redirect('/profile')
}
const editUser = async (req, res) => {
    let user;
    try {
        user = await User.findOne({ _id: req.params.userId },)
    } catch (error) { res.send(error) }
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
    user.phone = req.body.phone;
    user.role = req.body.userRole;
    user.email = req.body.email;
    user.name = req.body.name;
    user.age = req.body.age;
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
    user.subEnd = moment(req.body.subEnd).format('YYYY-MM-DD') || "";
    user.refs = req.body.refs
    user.avatarImg = avatarImgPath;
    user.coverImg = coverImgPath;
    await user.save()
    res.redirect(`/user/${user._id}`)
}


const deletePlans = async (req, res) => {
    const planId = req.params.planId;
    try {
        await Plan.findOneAndDelete({ _id: planId });
        res.redirect('/plans')
    } catch (error) {
        res.render('404')
    }
}
const deletePost = async (req, res) => {
    const postId = req.params.postId;
    try {
        await Post.findOneAndDelete({ _id: postId });
        res.redirect('/posts')
    } catch (error) {
        res.render('404')
    }
}
const clearChat = async (req, res) => {
    try {
        await Message.deleteMany({})
        res.redirect('back')
    } catch (error) {
        res.redirect('404')
    }
}
const clearConvs = async (req, res) => {
    try {
        await Chat.deleteMany({})
        res.redirect('back')
    } catch (error) {
        res.render('404')
    }
}
const deleteBook = async (req, res) => {
    const bookId = req.params.bookId;
    try {
        const book = await Book.findOne({ _id: bookId });
        if (book.img.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + book.img.replace('public', '').split('/').join('\\'), (err) => { });
        }
        if (book.pdf.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + book.pdf.replace('public', '').split('/').join('\\'), (err) => { });
        }
        await Book.findOneAndDelete({ _id: bookId });
        res.redirect('/books')
    } catch (error) {
        res.render('404')
    }
}


const reportDelete = async (req, res) => {
    const reportId = req.params.reportId;
    try {
        await Report.findOneAndDelete({ _id: reportId });
        res.redirect('/reports')
    } catch (error) {
        res.render('404')
    }
}
const contactDelete = async (req, res) => {
    const contactId = req.params.contactId;
    try {
        await Contact.findOneAndDelete({ _id: contactId });
        res.redirect('/contacts')
    } catch (error) {
        res.render('404')
    }
}
const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findOne({ _id: userId });
        if (user.avatarImg.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + user.avatarImg.replace('public', '').split('/').join('\\'), (err) => { });
        }
        if (user.coverImg.length !== 0) {
            fs.unlink(appRoot + '/' + 'public' + user.coverImg.replace('public', '').split('/').join('\\'), (err) => { });
        }
        await User.findOneAndDelete({ _id: userId });
        res.redirect('/users')
    } catch (error) {
        res.render('404')
    }
}

// View controllers----------
// View controllers----------
// View controllers----------
const indexView = async (req, res) => {
    const trxs = await TRX.find().select('_id phone plan createdAt amount status');

    res.render(
        "index",
        { totalLogin: totalLogin, totalReg: totalReg, totalUp: totalUp, totalIncome: totalIncome, trxs: trxs.reverse() }
    );
}
// For View 
const loginView = (req, res) => {
    const msg = req.query.msg
    res.render(
        "login",
        { msg: msg }
    );
}

const settingsView = async (req, res) => {
    const sliders = await Slider.find()
    res.render(
        "settings",
        {
            sliders: sliders,
            payKeys: jsonDB.getData("/payKeys"),
            sms: jsonDB.getData("/sms"),
            links: jsonDB.getData("/footerLinks"),
            terms: policiesDB.getData("/terms"),
            policies: policiesDB.getData("/policies"),
            disclaimers: policiesDB.getData("/disclaimers"),
            about: policiesDB.getData("/about"),
        }
    );
}
const profileView = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        res.render("profile",
            { user: user }
        );
    } catch (error) {
        res.render('404')
    }
}
const usersView = async (req, res) => {
    const users = await User.find({}).select('name _id role email phone subEnd refs')
    res.render(
        "users",
        { users: users.reverse() }
    );
}
const tutorsView = async (req, res) => {
    const users = await User.find({ role: 'tutor' }).select('name _id email phone subEnd refs')
    res.render(
        "tutors",
        { users: users }
    );
}
const newUserView = async (req, res) => {
    res.render(
        "newUser",
        { role: req.body.role }
    );
}
const userView = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
        res.render(
            "user",
            { user: user, role: req.body.role }
        );
    } catch (error) {
        res.render(
            "404"
        );
    }
}
const reportsView = async (req, res) => {
    const reports = await Report.find();
    res.render(
        "reports",
        { reports: reports.reverse() }
    );
}
const reportView = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.reportId });
        res.render(
            "report",
            { report: report }
        );
    } catch (error) {
        res.render(
            "404"
        );
    }
}
const adminsView = async (req, res) => {
    const users = await User.find({ role: 'admin' }).select('name _id email phone')
    res.render(
        "admins",
        { users: users }
    );
}

const trxView = async (req, res) => {
    const trxs = await TRX.find().select('_id phone plan createdAt amount status');
    res.render(
        "trxs",
        { trxs: trxs.reverse() }
    );
}

const plansView = async (req, res) => {
    const plans = await Plan.find();
    res.render(
        "plans",
        { plans: plans.reverse() }
    );
}
const planView = async (req, res) => {
    try {
        const plan = await Plan.findOne({ _id: req.params.planId })
        res.render(
            "plan", { plan: plan }
        );
    } catch (error) {
        res.render("404");
    }
}
const addPlansView = async (req, res) => {
    res.render(
        "newPlan",
        {}
    );
}
const PostsView = async (req, res) => {
    try {
        const posts = await Post.find();
        res.render(
            "posts",
            { posts: posts.reverse() }
        );
    } catch (error) {
        res.render("404")
    }
}
const contactsView = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.render(
            "contacts",
            { contacts: contacts.reverse() }
        );
    } catch (error) {
        res.render("404")
    }
}
const contactView = async (req, res) => {
    try {
        const contact = await Contact.findOne({ _id: req.params.contactId })
        res.render(
            "contact",
            { contact: contact }
        );
    } catch (error) {
        res.render('404')
    }
}

const PostView = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId })
        res.render(
            "post",
            { post: post }
        );
    } catch (error) {
        res.render('404')
    }
}
const newPostView = async (req, res) => {
    res.render(
        "newPost",
        {}
    );
}
const BooksView = async (req, res) => {
    try {
        const books = await Book.find();
        res.render("books", { books: books.reverse() });
    } catch (error) {
        res.render("404");
    }
}
const BookView = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.bookId })
        res.render("book", { book: book, });
    } catch (error) {
        res.render("404");
    }
}
const newBookView = async (req, res) => {
    res.render("newBook", {});
}

const viewDivission = async (req, res) => {
    res.render(
        "newDivission",
        {}
    );
}
const viewDistrict = async (req, res) => {
    res.render(
        "newDistrict",
        {}
    );
}
const viewUpozilla = async (req, res) => {
    res.render(
        "newUpozilla",
        {}
    );
}
const viewUnion = async (req, res) => {
    res.render(
        "newUnion",
        {}
    );
}
const getSlides = async (req, res) => {
    try {
        const slides = await Slider.find().select('heading text img btn url');
        res.send({ slides: slides.reverse() });
    } catch (error) {
        res.status(400).json("404");
    }
}
const getStats = async (req, res) => {
    try {
        const users = await User.find();
        const students = await User.find({ role: 'user' });
        const tutors = await User.find({ role: 'tutor' });
        const posts = await Post.find();
        res.status(200).json({ users: users.length, students: students.length, tutors: tutors.length, posts: posts.length });
    } catch (error) {
        res.status(400).json("404");
    }
}
const getFooterLinks = async (req, res) => {
    try {
        res.status(200).json({ links: jsonDB.getData("/footerLinks") });
    } catch (error) {
        res.status(400).json("404");
    }
}
const getTerms = async (req, res) => {
    try {
        res.status(200).json({ html: policiesDB.getData("/terms") });
    } catch (error) {
        res.status(400).json("404");
    }
}
const getPolicies = async (req, res) => {
    try {
        res.status(200).json({ html: policiesDB.getData("/policies") });
    } catch (error) {
        res.status(400).json("404");
    }
}
const getDisclaimers = async (req, res) => {
    try {
        res.status(200).json({ html: policiesDB.getData("/disclaimers") });
    } catch (error) {
        res.status(400).json("404");
    }
}
const getAbout = async (req, res) => {
    try {
        res.status(200).json({ html: policiesDB.getData("/about") });
    } catch (error) {
        res.status(400).json("404");
    }
}
module.exports = {
    logout,
    smsSettongs,
    paySettings,
    footerLinkSettings,
    setTerms,
    setPolicies,
    setDisclaimers,
    setAbout,
    newContact,

    newSlider,
    updateSlider,
    deleteSlider,

    OTPverify,
    sendOTP,
    indexView,
    loginView,

    settingsView,

    profileView,
    usersView,
    userView,
    adminsView,

    trxView,

    plansView,
    planView,
    addPlansView,

    newUserView,
    tutorsView,

    PostsView,
    PostView,
    newPostView,

    BooksView,
    BookView,
    newBookView,

    createPlan,
    createPost,
    createBook,
    createUser,

    editPlan,
    editPost,
    editBook,
    editUser,
    editProfile,

    deletePlans,
    deletePost,
    deleteBook,
    deleteUser,
    viewDivission,
    viewDistrict,
    viewUpozilla,
    viewUnion,

    createDivission,
    createDistrict,
    createUpozilla,
    createUnion,
    getSlides,
    getStats,
    getFooterLinks,
    getTerms,
    getPolicies,
    getDisclaimers,
    getAbout,

    reportsView,
    reportView,
    reportDelete,

    contactsView,
    contactView,
    contactDelete,
    clearChat,
    clearConvs,
};