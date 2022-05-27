const express = require('express');

const router = express.Router();
const { 
    logout,
    smsSettongs,
    paySettings,
    newSlider,
    updateSlider,
    deleteSlider,
    sendOTP,   
    OTPverify,
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
    tutorsView ,
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
    reportView,
    reportsView,
    reportDelete,
    footerLinkSettings,
    setTerms,
    setPolicies,
    setDisclaimers,
    setAbout,
    contactsView,
    contactView,
    contactDelete,
    clearChat,
    clearConvs,


} = require('../controllers/adminPanelController')
//-------------

const {    
    isAuth,
    authVerify,
    adminVerify,
    superAdminVerify } = require('./../middleware/adminAuth');
const {bookUpload,userUpload,sliderUpload} = require('./../middleware/fileUploader')   
    //-------------

router.get('/login', loginView );
router.get('/logout', logout );
router.post('/login', sendOTP );
router.post('/login/verify',OTPverify);

router.get('/',                                     adminVerify,       indexView );
//--------Settings---       
router.get('/settings',                             adminVerify,       settingsView );
router.get('/settings/clear-chats',                 superAdminVerify,  clearChat );
router.get('/settings/clear-convs',                 superAdminVerify,  clearConvs );
router.get('/settings/divission',                   adminVerify,       viewDivission );
router.get('/settings/district',                    adminVerify,       viewDistrict );
router.get('/settings/upozilla',                    adminVerify,       viewUpozilla );
router.get('/settings/union',                       adminVerify,       viewUnion );
router.post('/settings/divission',                  adminVerify,       createDivission );
router.post('/settings/district',                   adminVerify,       createDistrict );
router.post('/settings/upozilla',                   adminVerify,       createUpozilla );
router.post('/settings/union',                      adminVerify,       createUnion );

router.post('/settings/sms',                        superAdminVerify,       smsSettongs );
router.post('/settings/gateway',                    superAdminVerify,       paySettings );
router.post('/settings/footer',                     superAdminVerify,       footerLinkSettings );
router.post('/settings/terms',                      superAdminVerify,       setTerms );
router.post('/settings/policies',                   superAdminVerify,       setPolicies );
router.post('/settings/disclaimers',                superAdminVerify,       setDisclaimers );
router.post('/settings/about',                      superAdminVerify,       setAbout );
//--------Settings> slider----      
router.post('/slider',                              adminVerify,       newSlider );
router.post('/update-slider/:sliderId',             adminVerify,       sliderUpload,updateSlider );
router.post('/delete-slider/:sliderId',             adminVerify,       deleteSlider );
router.get('/profile',                              adminVerify,       profileView );
router.post('/profile/:userId',     authVerify,      adminVerify,       userUpload,editProfile );
//--------Plans--------     
router.get('/plans',                                adminVerify,       plansView );
router.post('/plans',              superAdminVerify,adminVerify,       createPlan );
router.get('/plan/:planId',                         adminVerify,       planView );
router.post('/plan/:planId',       superAdminVerify,adminVerify,       editPlan);
router.post('/plan/:planId/delete',superAdminVerify,adminVerify,       deletePlans );
router.get('/plans/new',           superAdminVerify,adminVerify,       addPlansView );
//---------Posts-------     
router.get('/posts',                                adminVerify,       PostsView );
router.post('/posts',                               adminVerify,       createPost );
router.get('/post/:postId',                         adminVerify,       PostView );
router.post('/post/:postId',        authVerify,     adminVerify,       editPost);
router.post('/post/:postId/delete', authVerify,     adminVerify,       deletePost );
router.get('/posts/new',                            adminVerify,       newPostView );
//---------Books-------     
router.get('/books',                                adminVerify,       BooksView );
router.post('/books',                               adminVerify,       bookUpload,isAuth,createBook );
router.get('/book/:bookId',                         adminVerify,       BookView );
router.post('/book/:bookId',        authVerify,     adminVerify,       bookUpload,editBook );
router.post('/book/:bookId/delete', authVerify,     adminVerify,       deleteBook );
router.get('/books/new',                            adminVerify,       newBookView );
//---------Users-------     
router.get('/users',                                adminVerify,       usersView );
router.post('/users',                               adminVerify,       userUpload,createUser );
router.get('/user/:userId',                         adminVerify,       userView );
router.post('/user/:userId',        authVerify,     adminVerify,       userUpload,editUser );
router.post('/user/:userId/delete', authVerify,     adminVerify,       deleteUser );
router.get('/users/new',                            adminVerify,       newUserView );
//---------Others--------       
router.get('/admins',                               adminVerify,       adminsView );
router.get('/tutors',                               adminVerify,       tutorsView );
router.get('/trxs',                                 adminVerify,       trxView );

router.get('/reports',                              adminVerify,       reportsView );
router.get('/report/:reportId',                     adminVerify,       reportView );
router.post('/report/:reportId/delete',             adminVerify,       reportDelete );

router.get('/contacts',                              adminVerify,       contactsView );
router.get('/contact/:contactId',                    adminVerify,       contactView );
router.post('/contact/:contactId/delete',            adminVerify,       contactDelete );
module.exports = router;        