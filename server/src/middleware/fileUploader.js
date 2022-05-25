const multer = require('multer');
const path = require('path');






const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == 'avater') {
      cb(null, 'public/uploads/user/avatar')
    } else if (file.fieldname == 'cover') {
      cb(null, 'public/uploads/user/cover')
    }
  },
  filename: function (req, file, cb) {
    if (file.fieldname == 'avater') {
      const fileExt = path.extname(file.originalname)
      const name = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
      cb(null, name + fileExt)
    } else if (file.fieldname == 'cover') {
      const fileExt = path.extname(file.originalname)
      const name = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
      cb(null, name + fileExt)
    }
  }
})

const sliderStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/app/sliders')
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname)
    const name = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
    cb(null, name + fileExt)
  }
})

const bookStorage = multer.diskStorage({
  destination:async function (req, file, cb) {
    if (file.fieldname == 'img') {
      cb(null, 'public/uploads/app/books/img')
    } else if (file.fieldname == 'pdf') {
      cb(null, 'public/uploads/app/books/pdf')
    }
  },
  filename:async function (req, file, cb) {
    if (file.fieldname == 'img') {
      const fileExt = path.extname(file.originalname)
      const name = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
      cb(null, name + fileExt)
    } else if (file.fieldname == 'pdf') {
      const fileExt = path.extname(file.originalname)
      const name = file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
      cb(null, name + fileExt)
    }
  }
})

// Uploader middlewares--------------
const userUpload = multer({
    storage: userStorage,
    limits: {
      fileSize: 2000000
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) { cb(null, true) }
      else {
        cb(null,false)
      }
    }
  }).fields([
    { name: 'avater', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]);

const sliderUpload = multer({
    storage: sliderStorage,
    limits: {
      fileSize: 2000000
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) { cb(null, true) }
      else {
        cb(null,false)
      }
    }
  }).single('img');

const bookUpload = multer({
    storage: bookStorage,
    fileFilter:async (req, file, cb) => {
      if (file.fieldname == 'img') {
        if (
          file.mimetype == 'image/png' ||
          file.mimetype == 'image/jpg' ||
          file.mimetype == 'image/jpeg'
        ) { cb(null, true) }
        else {
          cb(null,false)
        }
      } else if (file.fieldname == 'pdf') {
        if (
          file.mimetype == 'application/pdf'
        ) { cb(null, true) }
        else {
          cb(null,false)
        }
      } else {
        cb(null,false)
      }
    }

  }).fields([
    { name: 'img', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
  ]);




module.exports = {
  userUpload,
  sliderUpload,
  bookUpload
}