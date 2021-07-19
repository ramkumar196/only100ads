var express = require('express');
var router = express.Router();
const { body, check, header, param, validationResult, query, file } = require('express-validator');
var jwt = require('jsonwebtoken');
var fs = require('fs');
const path = require('path');
var usersModel = require('../models/users');
var adModel = require('../models/ads');
const mongoose = require('mongoose');
var Jimp = require('jimp');

const { formatAdResponse, extractHastags, replaceHastags } = require('../utils/formatResponse')

var { putS3Object, getS3Object } = require('../utils/s3Functions');
var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/Ads");
  },
  filename: function (req, file, callback) {
    let currentTime = new Date();
    callback(null, currentTime.getTime() + "-" + file.originalname);
  },
  fileFilter: function (req, file, cb) {
    let filetypes = /jpeg|jpg|png|gif|mp4/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      req.file = file;
      return cb(null, true);
    }
    cb(new Error('Invalid IMAGE Type'))
  }
});

var upload = multer({ storage: storage }).single('adMedia');

var { v4 } = require('uuid');
var randomstring = require("randomstring");

router.post('/uploadAdMedia',
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
          //await putS3Object(req.file.buffer,req.file.originalname);
          res.status(200).json({ message: "Success", details: { "fileName": req.file.filename, "files": req.file } });
        } catch (error) {
          res.status(400).json({ message: "Failed" });

        }
      });
    }
  });

router.post('/create',
  body('adMedia').not().isEmpty().withMessage('must not be empty'),
  body('adText').not().isEmpty().withMessage('must not be empty'),
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {

      try {
        let reqParams = req.body;
        //reqParams.clientIp = request.connection.remoteAddress;
        console.log("req.userId", req.userId);

        reqParams.createdBy = req.userId;
        let hashtagList = await extractHastags(reqParams.adText);
        let adHtmlText = await replaceHastags(reqParams.adText);
        reqParams.hashtags = hashtagList;
        reqParams.adHtmlText = adHtmlText;
        const ad = new adModel(reqParams);

        ad.save(ad, async function (err) {

          if (err) {
            res.status(400).json(err);
          }
          res.status(200).json({ message: "Success", details: { "ad": ad } });

        });
      } catch (error) {
        res.status(400).json({ message: "Failed", error: error });

      }
    }
  });

router.get('/list',
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {

      try {
        console.log("herererer1111");

        let search = req.query.keywords;
        console.log("herererer1111", search);

        let match_array = {
          'createdBy': new mongoose.Types.ObjectId(req.userId),
          'adStatus': true
        };

        if (search && search.hashtags) {
          match_array = { $text: { $search: search.hashtags } }

        }

        var arguments = [
          {
            '$match': match_array,
          },
          {
            '$lookup': {
              'from': 'users',
              'localField': 'createdBy',
              'foreignField': '_id',
              'as': 'user',
            },
          },
          { '$unwind': '$user' },
          {
            '$project': {
              '_id': 1,
              'adText': '$adText',
              'createdAt': '$createdAt',
              'createdAtFormat': {
                '$dateFromString': {
                  'dateString': '$createdAt',
                  'timezone': 'Asia/Kolkata',
                  'format': "%d-%m-%Y",
                  'onError': '$createdAt'

                }
              },
              'username': '$user.username',
              'profileImage': '$user.profileImage',
              'adImages': '$adImages',
              'adHtmlText': '$adHtmlText',
              'hashtags': '$hashtags',
            }
          },
          { '$sort': { 'createdAt': -1 } }

        ]

        let ads = await adModel.aggregate(arguments);
        if (ads.length > 0) {
          let adList = await formatAdResponse(req, ads);
          res.status(200).json({ message: "Success", details: { "ads": adList } })
        } else {
          res.status(200).json({ message: "No Data" });
        }
      } catch (error) {
        res.status(400).json({ message: "Failed", error: error });

      }
    }
  });
module.exports = router;
