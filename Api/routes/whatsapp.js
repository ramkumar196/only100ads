var express = require('express');
var router = express.Router();
const { body,check,header,param,validationResult, query } = require('express-validator');
var jwt = require('jsonwebtoken');
var fs = require('fs');
const path = require('path');
var usersModel = require('../models/users');
var  sendEmail  = require('../utils/email');
var  verifyToken  = require('../utils/auth');
var  validateAssertion  = require('../utils/googleAuth');
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC0049681f329e5a34067e94ca5dbe5c4b';
const authToken = process.env.TWILIO_AUTH_TOKEN || '9fd78de8fac246d87015ea5e823a6295';
const client = require('twilio')(accountSid, authToken);
var { v4 } = require('uuid');
var randomstring = require("randomstring");

/* GET users listing. */
router.post('/sendMessage',
  body('phone').not().isEmpty().withMessage('must not be empty'),
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {
        let response = client.messages
              .create({
                 from: 'whatsapp:+14155238886',
                 body: 'Hello, there!',
                 to: 'whatsapp:+917373246886'
               })
              .then(message => console.log(message.sid))
              .catch(error => console.log("error",error))
        res.status(200).json({message:response})
    }
  });



  module.exports = router;
