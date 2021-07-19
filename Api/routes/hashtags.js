var express = require('express');
var router = express.Router();
const { body,check,header,param,validationResult, query } = require('express-validator');
var hashtagModel = require('../models/hashtags');
//AKIAQ4PBLAIH5PV4VS5P
//X/Mc/R5xer9RD+/muLvEfB5HF4QaEBMq7lhnD7gd

router.get('/list',
//body('adText').not().isEmpty().withMessage('must not be empty'),
//body('adSlot').not().isEmpty().withMessage('must not be empty'),
//body('adMedia').not().isEmpty().withMessage('must not be empty'),
async function (req, res, next) {
  console.log(req.file);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors)
  } else {
        try {
            let hashtags = await hashtagModel.find();
            res.status(200).json({message:"Success",details:hashtags});

        } catch (error) {
          res.status(400).json({message:"Failed",error:error});

        }
    }

});

module.exports = router;