var express = require('express');
var router = express.Router();
const { body,check,header,param,validationResult, query } = require('express-validator');
var hashtagModel = require('../models/hashtags');
router.get('/list',
async function (req, res, next) {
  console.log(req.file);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors)
  } else {
        try {
            let hashtags = [];
            console.log("keyword",req.query.keyword);

            if(req.query.keyword) {
              hashtags = await hashtagModel.find({ hashtag: { $regex: req.query.keyword, $options: "i" }}).limit(10);
              res.status(200).json({message:"Success",details:hashtags});

            } else {
              hashtags = await hashtagModel.find().limit(10);
              res.status(200).json({message:"Success",details:hashtags});

            }
            

        } catch (error) {
          res.status(400).json({message:"Failed",error:error});

        }
    }

});

module.exports = router;
