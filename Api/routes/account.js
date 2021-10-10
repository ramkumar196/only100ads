var express = require('express');
var router = express.Router();
const { body, check, header, param, validationResult, query, file } = require('express-validator');
var jwt = require('jsonwebtoken');
var fs = require('fs');
const path = require('path');
var adModel = require('../models/ads');
const mongoose = require('mongoose');
const sharp = require("sharp");
var usersModel = require('../models/users');

const sharpStream = sharp({
  failOnError: false
});

const { formatUserResponse } = require('../utils/formatResponse')

var { putS3Object, getS3Object } = require('../utils/s3Functions');
var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/Users");
  },
  filename: function (req, file, callback) {
    let currentTime = new Date();
    callback(null, currentTime.getTime() + "-" + file.originalname);
  },
  fileFilter: function (req, file, cb) {
    let filetypes = /jpeg|jpg|png|gif/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      req.file = file;
      return cb(null, true);
    }
    cb(new Error('Invalid IMAGE Type'))
  }
});

var upload = multer({ storage: storage }).single('profileImage');

var { v4 } = require('uuid');
var randomstring = require("randomstring");




router.post('/uploadUserProfile',
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {
      upload(req, res, async function (err) {
        let currentTime = new Date();

        // FILE SIZE ERROR
        if (err instanceof multer.MulterError) {
          return res.status(422).json({ message: "Max file size 2MB allowed!", error: err });
        }

        // INVALID FILE TYPE, message will return from fileFilter callback
        else if (err) {
          return res.status(422).json({ message: err.message });
        }

        // FILE NOT SELECTED
        else if (!req.file) {
          return res.status(422).json({ message: "File is required!" });
        }
        try {
        //   const promises = [];
        //   promises.push(
        //     sharp(req.file.path)
        //     .resize(600, 400)
        //     .toFile("uploads/Users/600X400_"+req.file.filename), function(err) {
        //       console.log("sharp error",err);
        //       // output.jpg is a 300 pixels wide and 200 pixels high image
        //       // containing a scaled and cropped version of input.jpg
        //     });
        //   Promise.all(promises)
        //   .then(res => { console.log("Done!", res); })
        //   .catch(err => {
        //     console.error("Error processing files, let's clean it up", err);
        //     try {
        //       // fs.unlinkSync("originalFile.jpg");
        //       // fs.unlinkSync("optimized-500.jpg");
        //       // fs.unlinkSync("optimized-500.webp");
        //     } catch (e) {}
        //   });
          //await putS3Object(req.file.buffer,req.file.originalname);
          res.status(200).json({ message: "Success", details: { "fileName": req.file.filename, "files": req.file } });
        } catch (error) {
          res.status(400).json({ message: "Failed" });

        }
      });
    }
  });

router.post('/updateProfile',
body('userName').not().isEmpty().withMessage('must not be empty'),
body('email').not().isEmpty().withMessage('must not be empty'),
body('website').not().isEmpty().withMessage('must not be empty'),
body('website').isURL().withMessage('must not be empty'),
//body('profileImage').not().isEmpty().withMessage('must not be empty'),
async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors)
  } else {
      try {
        let reqParams = req.body;
        delete reqParams.userName;
        delete reqParams.email;

        let update = await usersModel.updateOne({_id:req.userId},reqParams);
        if(update){
        res.status(200).json({ message: "Success"})
      } else {
        res.status(200).json({ message: "No Data" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed", error: error });

    }
  }
});


router.post('/updatePassword',
body('currentPassword').not().isEmpty().withMessage('must not be empty'),
body('newPassword').not().isEmpty().withMessage('must not be empty'),
body('confirmPassword').not().isEmpty().withMessage('must not be empty'),
async function (req, res, next) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json(errors)
  } else {
    let userDetails = await usersModel.findOne({_id:req.userId});
    let comparePassword = await userDetails.comparePassword(req.body.currentPassword);
    console.log(userDetails,comparePassword);
    if(comparePassword && userDetails){
      if(req.body.newPassword == req.body.confirmPassword){
      let update = await usersModel.updateOne({_id:req.userId},{password:req.body.newPassword});
      res.status(200).json({message:"Password Updated!!!"})
      } else {
        res.status(422).json({message:"Confirm password is not same!!!"})
      }
    } else {
      res.status(404).json({message:"User Not found"})
    }
  }
});

router.get('/userDetails',
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {
        try {
        let userDetails = await usersModel.findOne({_id:req.userId});
        console.log("userDetails",userDetails);
        if (userDetails) {
          let userDetail = await formatUserResponse(req, userDetails);
          res.status(200).json({ message: "Success", details: userDetail })
        } else {
          res.status(200).json({ message: "No Data" });
        }
      } catch (error) {
        res.status(400).json({ message: "Failed", error: error });

      }
    }
  });
module.exports = router;
