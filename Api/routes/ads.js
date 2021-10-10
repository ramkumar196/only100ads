var express = require('express');
var router = express.Router();
const { body, check, header, param, validationResult, query, file } = require('express-validator');
var jwt = require('jsonwebtoken');
var fs = require('fs');
const path = require('path');
var usersModel = require('../models/users');
var adModel = require('../models/ads');
const mongoose = require('mongoose');
const sharp = require("sharp");
const sharpStream = sharp({
  failOnError: false
});

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
          const promises = [];
          promises.push(
            sharp(req.file.path)
            .resize(600, 400)
            .toFile("uploads/Ads/600X400_"+req.file.filename), function(err) {
              console.log("sharp error",err);
              // output.jpg is a 300 pixels wide and 200 pixels high image
              // containing a scaled and cropped version of input.jpg
            });
          Promise.all(promises)
          .then(res => { console.log("Done!", res); })
          .catch(err => {
            console.error("Error processing files, let's clean it up", err);
            try {
              // fs.unlinkSync("originalFile.jpg");
              // fs.unlinkSync("optimized-500.jpg");
              // fs.unlinkSync("optimized-500.webp");
            } catch (e) {}
          });
          //await putS3Object(req.file.buffer,req.file.originalname);
          res.status(200).json({ message: "Success", details: { "fileName": req.file.filename, "files": req.file } });
        } catch (error) {
          res.status(400).json({ message: "Failed" });

        }
      });
    }
  });

router.post('/create',
  //body('adMedia').not().isEmpty().withMessage('must not be empty'),
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

        let search = req.query.hashtags;
        let page = req.query.page;


        let match_array = {
         // 'createdBy': new mongoose.Types.ObjectId(req.userId),
          'adStatus': true
        };

        if (search) {
          match_array = { hashtags: { $in: search.split() } }
        }
        console.log(match_array);

        let offset = 0;
        let limit = 10;

        if(page && page != 0){
          offset = page * 10;
        }

        console.log("match_array",match_array);

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
              'userName': '$user.userName',
              'website': '$user.website',
              'profileImage': '$user.profileImage.image',
              'adImages': '$adImages',
              'adHtmlText': '$adHtmlText',
              'hashtags': '$hashtags',
            }
          },
          { '$sort': { 'createdAt': -1 } },
          { '$limit': limit},
          { '$skip': offset}

        ]

        console.log("arguments",arguments);

        let ads = await adModel.aggregate(arguments);
        if (ads.length > 0) {
          let adList = await formatAdResponse(req, ads);
          res.status(200).json({ message: "Success", details: adList })
        } else {
          res.status(200).json({ message: "No Data", details: [] });
        }
      } catch (error) {
        res.status(400).json({ message: "Failed", error: error });

      }
    }
  });

  router.get('/list-no-auth',
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {

      try {

        let search = req.query.hashtags;
        let page = req.query.page;


        let match_array = {
         // 'createdBy': new mongoose.Types.ObjectId(req.userId),
          'adStatus': true
        };

        if (search) {
          match_array = { hashtags: { $in: search.split() } }
        }
        console.log(match_array);

        let offset = 0;
        let limit = 10;

        if(page && page != 0){
          limit = 10*parseInt(page);
          offset = limit -10;
        }

        console.log("match_array",match_array);

        let arguments = [
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
              'userName': '$user.userName',
              'website': '$user.website',
              'profileImage': '$user.profileImage.image',
              'adImages': '$adImages',
              'adHtmlText': '$adHtmlText',
              'hashtags': '$hashtags',
            }
          },
        ];
        
        let totalCount = 0

        try {
        let countArguments = [
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
              'userName': '$user.userName',
              'website': '$user.website',
              'profileImage': '$user.profileImage.image',
              'adImages': '$adImages',
              'adHtmlText': '$adHtmlText',
              'hashtags': '$hashtags',
            }
          },
        ];;
        countArguments.push({ $group: { _id: null, count: { $sum: 1 } } });
        let adsCount = await adModel.aggregate(countArguments);
 
        console.log("adsCount",adsCount);

        totalCount = (adsCount.length > 0)?adsCount[0].count:0;
        }
        catch(err){
          console.log(err);
        }

        arguments.push({ '$sort': { 'createdAt': -1 }});
        arguments.push({ '$limit': limit});
        arguments.push({ '$skip': offset});
        console.log("arguments",arguments);

        let ads = await adModel.aggregate(arguments);



        if (ads.length > 0) {
          let adList = await formatAdResponse(req, ads);
          res.status(200).json({ message: "Success", details: adList,total:totalCount })
        } else {
          res.status(200).json({ message: "No Data", details: [] });
        }
      } catch (error) {
        res.status(400).json({ message: "Failed", error: error });

      }
    }
  });
module.exports = router;
 