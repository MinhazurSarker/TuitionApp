const Notification = require('../models/Notification');
const Post = require('../models/Post');
const Report = require('../models/Report');
const User = require('../models/User');
const { userFollow } = require('./userController');

//-----------------
const getPosts = async (req, res) => {
    const { div, dis, upo, uni, search } = req.query
    const searchString = search.toString()
    const Model = Post;
    let data
    if (div.length !== 0 && dis.length !== 0 && upo.length !== 0 && uni.length !== 0) {
        data = await Model.find({
            divission: div,
            district: dis,
            upozilla: upo,
            union: uni,
            $or: [
                { desc: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (div.length !== 0 && dis.length !== 0 && upo.length !== 0) {
        data = await Model.find({
            divission: div,
            district: dis,
            upozilla: upo,
            $or: [
                { desc: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (div.length !== 0 && dis.length !== 0) {
        data = await Model.find({
            divission: div,
            district: dis,
            $or: [
                { desc: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (div.length !== 0) {
        data = await Model.find({
            divission: div,
            $or: [
                { desc: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else {
        data = await Model.find({
            $or: [
                { desc: { $regex: searchString, $options: 'i' } }
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
const getPostsMyLoc = async (req, res) => {
    const user = await User.findOne({ _id: req.body.userId })
    const searchString = req.query.search.toString()
    const Model = Post;
    let data
    if (user.divission.length !== 0 && user.district.length !== 0 && user.upozilla.length !== 0 && user.union.length !== 0) {
        data = await Model.find({
            divission: user.divission,
            district: user.district,
            upozilla: user.upozilla,
            union: user.union,
            $or: [
                { name: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (user.divission.length !== 0 && user.district.length !== 0 && user.upozilla.length !== 0) {
        data = await Model.find({
            divission: user.divission,
            district: user.district,
            upozilla: user.upozilla,
            $or: [
                { name: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (user.divission.length !== 0 && user.district.length !== 0) {
        data = await Model.find({
            divission: user.divission,
            district: user.district,
            $or: [
                { name: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else if (user.divission.length !== 0) {
        data = await Model.find({
            divission: user.divission,
            $or: [
                { name: { $regex: searchString, $options: 'i' } }
            ],
        });
    } else {
        data = await Model.find({
            $or: [
                { name: { $regex: searchString, $options: 'i' } }
            ],
        });

    }

    const page = parseInt(req.query.page) || 1;
    const pages = (data.length / 20 | 0) + 1;
    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;
    if (data) {
        var newData = data.reverse();
        var resData = newData.slice(startIndex, endIndex) || "No data found";
        res.status(200).send({
            data: resData,
            lastPage: endIndex >= data.length ? true : false,
            pages: pages,
            current: page
        });
    } else {
        res.status(400).send({ data: "No data found" });
    }

}
//-----------------
const createPosts = async (req, res) => {
    try {
        const post = await new Post({
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
        post.save()
        const users = await User.find({
            divission: req.body.divission,
            district: req.body.district,
            upozilla: req.body.upozilla,
            union: req.body.union
        }).select('_id')
        let notifyTo = users.map(a => a._id);
        const notification = await new Notification({
            title: post.desc,
            author: req.body.userId,
            postId: post._id,
            to: notifyTo
        })
        notification.save()
        res.status(200).json({ msg: "Post created successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", });
    }





}
//------------------
const updatePosts = async (req, res) => {
    const post = await Post.findOneAndUpdate(
        { _id: req.params.postId },
        {
            desc: req.body.desc,
            class: req.body.class,
            days: req.body.days,
            lang: req.body.lang,
            salary: req.body.salary,
            subjects: req.body.subjects,
            location: req.body.location,
            map: req.body.map
        }
    );
    await post.save().then((result) => {
        res.status(200).json({ msg: "Post updated successfully", result });
    }).catch((err) => {
        res.status(500).json({ msg: "Something went wrong", err });
    });
}
//-------------------
const likePost = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.body.likedId });
        const userId = req.body.userId;
        if (!post.liked.includes(userId)) {
            await post.updateOne({ $push: { liked: userId } });
            res.status(200).json({msg:"Added to favorites"});
        } else {
            await post.updateOne({ $pull: { liked: userId } });
            res.status(200).json({msg:"Removed from favorites"});
        }
    } catch (err) {
        res.status(500).json({msg:err});
    }
}
const deletePosts = async (req, res) => {
    await Post.deleteOne({ _id: req.params.postId });
    res.status(200).send("Successfully deleted");
}
const postsLiked = async (req, res) => {
    const searchString = req.query.search.toString()

    try {
        const posts = await Post.find({
             liked: { $in: req.body.userId } ,
             $or: [
                { desc: { $regex: searchString, $options: 'i' } },
                { subjects: { $regex: searchString, $options: 'i' } },
                
            ]
            });
        const page = parseInt(req.query.page) || 1;
        const pages = (posts.length / 20 | 0) + 1;
        const startIndex = (page - 1) * 20;
        const endIndex = page * 20;
        res.status(200).send({
            data: posts.reverse().slice(startIndex, endIndex) || "No data found",
            lastPage: endIndex >= posts.length ? true : false,
            pages: pages,
            current: page
        });
        
    } catch (err) {
        res.status(500).json(err);
    }
}
const reportPost = async (req, res) => {
    try {
        const report = await new Report({
            by: req.body.userId,
            reported: req.params.postId,
            type: 'post',
            reason: req.body.reason,
            desc: req.body.desc,
        });
        report.save()
        res.status(200).json({ msg: "Reported successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong", });
    }
}

const getPost = async (req, res) => {
    try {
        const reqUserRole = req.body.role
        const post = await Post.findOne({ _id: req.params.postId }).populate('userID', 'coverImg avatarImg name phone gender');
       
        if (!reqUserRole || reqUserRole == undefined || reqUserRole == 'user') {
            const resData = {
                _id: post._id,
                class: post.class,
                days: post.days,
                desc: post.desc,
                lang: post.lang,
                salary: post.salary,
                subjects: post.subjects,
                divission: post.divission,
                district: post.district,
                upozilla: post.upozilla,
                union: post.union,
                lan: null,
                lon: null,
                liked: post.liked.length,
                author: {
                    _id: post.userID._id,
                    name: post.userID.name,
                    avatarImg: post.userID.avatarImg,
                    coverImg: post.userID.coverImg,
                    gender: post.userID.gender,
                    phone: null,
                }
            }
            res.status(200).json(resData);
        } else if (reqUserRole == 'tutor' || reqUserRole == 'super' || reqUserRole == 'admin') {
            const resData = {
                _id: post._id,
                class: post.class,
                days: post.days,
                desc: post.desc,
                lang: post.lang,
                salary: post.salary,
                subjects: post.subjects,
                divission: post.divission,
                district: post.district,
                upozilla: post.upozilla,
                union: post.union,
                lan: post.lan,
                lon: post.lon,
                liked: post.liked.length,
                author: {
                    _id: post.userID._id,
                    name: post.userID.name,
                    avatarImg: post.userID.avatarImg,
                    coverImg: post.userID.coverImg,
                    gender: post.userID.gender,
                    phone: post.userID.phone,
                }
            }
            res.status(200).json(resData);
        } else {
            res.status(400).json({ msg: "No post found 1" });
        }

    } catch (error) {
      
        res.status(400).json("No post found 3");
    }

}

//-------------------
module.exports = {
    getPosts,
    getPost,
    createPosts,
    updatePosts,
    likePost,
    deletePosts,
    getPostsMyLoc,
    postsLiked,
    reportPost
}