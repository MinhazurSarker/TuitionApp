const User = require('./../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const Post = require('../models/Post');
const Book = require('../models/Book');
dotenv.config();
const jwt_secret = process.env.JWT_SECRET;



//--------------
const isAuth = async (req, res, next) => {
    const token = req.headers.token || req.cookies.token || req.query.token;
    let Id;
    if (token) {
        jwt.verify(token, jwt_secret, (err, decoded) => { Id = decoded.userId; });
        const user = await User.findOne({ _id: Id });
        if (user) {
            req.body.userId = user._id;
            req.body.role = user.role;
            next();
        } else {
            res.status(401).redirect('/login?msg=You are not Logged in.');
        }
    } else {
        res.status(401).redirect('/login?msg=You are not Logged in.');
    }
}
//---------------

const authVerify = async (req, res, next) => {
    const token = req.headers.token || req.cookies.token || req.query.token;
    const postId = req.params.postId;
    const bookId = req.params.bookId;
    const tId = req.params.userId;
    let Id;
    try {
        jwt.verify(token, jwt_secret, (err, decoded) => { Id = decoded.userId; });
        const user = await User.findOne({ _id: Id });
        try {
            if (tId) {
                try {
                    const tUser = await User.findOne({ _id: tId })
                    if (tUser.role == 'super') {
                        next();
                    } else if (tUser.role == 'admin') {
                        if (tUser.role == 'admin' && tId == user._id.toString()) {
                            next();
                        } else if (tUser.role == 'admin' && user.role == 'super') {
                            next();
                        } else {
                            res.status(404).render('401', { msg: 'You can not view or edit this account' });
                        }
                    } else if (tUser.role == 'user' || tUser.role == 'tutor') {
                        if (tId == user._id.toString() || user.role == 'admin' || user.role == 'super') {
                            next();
                        } else {
                            res.status(404).render('401', { msg: 'You can not view or edit this account' });
                        }
                    } else {
                        res.status(404).render('401', { msg: 'You can not view or edit this account' });
                    }
                } catch (error) {
                    res.status(401).render('401', { msg: 'No user found to edit' });
                }
            }
            else if (postId) {
                try {
                    const tPost = await Post.findOne({ userID: user._id })
                    const postOwner = await User.findOne({ _id: tPost.userID })
                    if (postOwner.role == 'super') {
                        next();
                    } else if (postOwner.role == 'admin') {
                        if (postOwner.role == 'admin' && tPost.userID.toString() == user._id.toString()) {
                            next();
                        }
                        else if (postOwner.role == 'admin' && user.role == 'super') {
                            next();
                        } else {
                            res.status(404).render('401', { msg: 'You can not view or edit this Post' });
                        }
                    } else if (postOwner.role == 'user' || postOwner.role == 'tutor') {
                        if (tPost.userID.toString() == user._id.toString() || user.role == 'admin' || user.role == 'super') {
                            next();
                        } else {
                            res.status(404).render('401', { msg: 'You can not view or edit this Post' });
                        }
                    } else {
                        res.status(404).render('401', { msg: 'You can not view or edit this Post' });
                    }
                }
                catch (error) {
                    res.status(404).render('401', { msg: 'No post found' });
                }
            }
            else if (bookId) {
                try {
                    const tBook = await Book.findOne({ userID: user._id})
                    try {
                        const bookOwner = await User.findOne({ _id: bookId.userID.toString() })
                        if (bookOwner.role = 'super' && user.role == 'super') {
                            next();
                        } else if (bookOwner.role == 'admin') {
                            if (bookOwner.role == 'admin' && tBook.userID.toString() == user._id.toString()) {
                                next();
                            }
                            else if (bookOwner.role == 'admin' && user.role == 'super') {
                                next();
                            } else {
                                res.status(404).render('401', { msg: 'You can not view or edit this Book' });
                            }
                        } else {
                            res.status(404).render('401', { msg: 'You can not view or edit this Book' });
                        }
                    } catch (error) {
                        res.status(404).render('401', { msg: 'You can not view or edit this Book' });
                    }
                        
                } catch (error) {
                    res.status(404).render('401', { msg: 'No book found'+ error });
                }
            }
            else {
                res.status(401).render('401', { msg: 'You are not sending any ID' });
            }
        } catch {
            res.status(404).render('401', { msg: 'You are not authorized user.' });
        }
    } catch {
        res.status(401).render('401', { msg: 'You are not Logged in.' });
    }
}
//---------------
const superAdminVerify = async (req, res, next) => {
    const token = req.headers.token || req.cookies.token || req.query.token;
    let Id;
    try {
        jwt.verify(token, jwt_secret, (err, decoded) => { Id = decoded.userId; });
        const user = await User.findOne({ _id: Id });
        if (user) {
            if (user.role == 'super') {
                req.body.userId = user._id;
                req.body.role = user.role;
                next();
            } else if (user.role == 'admin') {
                res.status(406).render('401', { msg: 'You are not Super Admin' });

            } else {
                res.status(406).render('401', { msg: 'You are not Super Admin' });
            }

        } else {
            res.status(406).render('401', { msg: 'You are not Super Admin' });
        }
    } catch (err) {
        res.status(406).render('401', { msg: 'You are not Super Admin' });
    }
}
const adminVerify = async (req, res, next) => {
    const token = req.headers.token || req.cookies.token || req.query.token;
    let Id;
    try {
        jwt.verify(token, jwt_secret, (err, decoded) => { Id = decoded.userId; });
        try {
            const user = await User.findOne({ _id: Id });
            if (user.role == 'admin' || user.role == 'super') {
                req.body.userId = user._id;
                req.body.role = user.role;
                next();
            } else {
                res.status(401).render('401', { msg: 'You are not Admin' });
            }
        } catch {
            res.status(406).render('401', { msg: 'You are not Admin' });
        }
    } catch (err) {
        res.status(401).render('401', { msg: 'You are not Admin.' });
    }
}

module.exports = {
    isAuth,
    authVerify,
    adminVerify,
    superAdminVerify
}