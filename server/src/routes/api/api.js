//------------------Modules-----------
const router = require('express').Router();


//------------------Controllers-------
const { getUser, sendOTP, LoginOrCreateUser, updateUser, deleteUser, getTutors, getTutorsMyLoc, phoneUpdateVerify, userFollow, followingUsers, upgradeByRefs, userRate, getMyProfileData, reportUser } = require('../../controllers/userController')
const { getPosts, createPosts, updatePosts, deletePosts, getPostsMyLoc, likePost, postsLiked, reportPost, getPost } = require('../../controllers/postController')
const { getDivissions, getDistricts, getUpozillas, getUnions } = require('../../controllers/locationController')
const { getPlans, createPlan, updatePlan, deletePlan } = require('../../controllers/planController')
const { payment, callBack } = require('../../controllers/paymentController')
const { getSlides, getStats, getFooterLinks, getTerms, getPolicies, getDisclaimers, getAbout, newContact} = require('../../controllers/adminPanelController')
const { comeToInbox, getChats, newMessage, getMessage, } = require('../../controllers/inboxController')


//------------------middlewares-------
const { guestOrAuth, isAuth, authVerify, adminVerify } = require('../../middleware/auth')
const { userUpload } = require('../../middleware/fileUploader');
const { getNotifications } = require('../../controllers/notificationController');
const { getBooks, getBook } = require('../../controllers/BooksController');


//------------------Routes------------
// User account creation & login related
router.get('/tutors', getTutors);
router.get('/tutors/my-area', isAuth, getTutorsMyLoc);
router.get('/user/:userId', guestOrAuth, getUser);
router.get('/users/followings', isAuth, followingUsers);
router.get('/user/upgrade-by-refs', isAuth, upgradeByRefs);
router.post('/auth', sendOTP);
router.post('/auth/verify', LoginOrCreateUser);
router.post('/report/user/:userId', isAuth, reportUser);
router.post('/user/updatePhone/:userId', authVerify, sendOTP);
router.post('/user/updatePhone/verify/:userId', authVerify, phoneUpdateVerify);
router.post('/user/follow/', isAuth, userFollow);
router.post('/user/rate/:userId', isAuth, userRate);
router.post('/user/edit/:userId', authVerify, userUpload, updateUser);
router.delete('/user/:userId', authVerify, deleteUser);
router.get('/my-profile', isAuth, getMyProfileData);
router.get('/my-profile/notifications', isAuth, getNotifications);

// Payment routes
router.post('/pay', isAuth, payment);//req by user
router.post('/callback', callBack);//req by payment gateway server

// Plan routes
router.get('/plans', getPlans);
router.post('/plans', adminVerify, createPlan);
router.put('/plans/:planId', adminVerify, updatePlan);
router.delete('/plans/:planId', adminVerify, deletePlan);

// Post related routes
router.get('/posts', getPosts);
router.get('/posts/:postId', guestOrAuth, getPost);
router.get('/posts-my-area', isAuth, getPostsMyLoc);
router.get('/liked-posts', isAuth, postsLiked);
router.post('/posts', isAuth, createPosts);
router.post('/report/post/:postId', isAuth, reportPost);
router.post('/post-edit/:postId', authVerify, updatePosts);
router.post('/posts/like/:postId', isAuth, likePost);
router.delete('/posts/:postId', authVerify, deletePosts);
// Post related routes
router.get('/slides', getSlides);


router.get('/divissions', getDivissions);
router.get('/districts', getDistricts);
router.get('/upozillas', getUpozillas);
router.get('/unions', getUnions);
router.get('/stats', getStats);
router.get('/footer-links', getFooterLinks);
router.get('/terms', getTerms);
router.get('/policies', getPolicies);
router.get('/disclaimers', getDisclaimers);
router.get('/about', getAbout);
router.post('/contact', newContact);

router.post('/inbox/', isAuth, comeToInbox)
router.get('/chats/', isAuth, getChats)
router.get('/messages/:chatId', isAuth, getMessage)
router.post('/message/', isAuth, newMessage)



router.get('/books', getBooks);

router.get('/book/:bookId', getBook );

module.exports = router;