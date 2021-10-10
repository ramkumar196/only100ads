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

var { v4 } = require('uuid');
var randomstring = require("randomstring");

/* GET users listing. */
router.post('/login',
  body('email').not().isEmpty().withMessage('must not be empty'),
  body('email').isEmail().withMessage('must be valid'),
  body('password').not().isEmpty().withMessage('must not be empty'),
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {
      let userDetails = await usersModel.findOne({email:req.body.email});
      if(userDetails){
      let comparePassword = await userDetails.comparePassword(req.body.password);
      console.log(comparePassword);
      if(comparePassword) {
          /*
          Private key Generation
          openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
          openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
          */
          var privateKey = fs.readFileSync(path.join(__dirname,'../key.pem'));
          jwt.sign({ email: req.body.email ,id : userDetails._id  }, privateKey, { algorithm: 'RS256',expiresIn: 60 * 60 } ,function(err, token) {
            if(err){
              console.log(err);
              res.status(400).json(err);
            }
            console.log(token);
          
          res.status(200).json({"token":token})
        });
        }
         else {
          res.status(200).json({message:"Wrong Password!!!"})
        }
      } else {
        res.status(404).json({message:"User Not found"})
      }
    }
  });


  router.get('/googleAuth', async (req, res) => {
  const assertion = req.header('X-Goog-IAP-JWT-Assertion');
  let email = 'None';
  try {
    const info = await validateAssertion(assertion);
    email = info.email;
  } catch (error) {
    console.log(error);
  }
  res.status(200).send(`Hello ${email}`).end();
});

  router.post('/forgotPassword',
  body('email').not().isEmpty().withMessage('must not be empty'),
  body('email').isEmail().withMessage('must be valid'),
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {
     let resetId = v4();
     let emailHtmlContent = "<html><body><h6>Hello</h6><p>You have requested a new password for your account.</p><p>Click the following link to automatically confirm your reset:</p><p>http://localhost:3000/resetpassword/"+resetId+"</p><p>Thank You</p></body></html>";

      let userDetails = await usersModel.findOne({email:req.body.email});
      if(userDetails) {
        await usersModel.updateOne({email:req.body.email},{resetId:resetId});
        sendEmail("ram196kumar@gmail.com",userDetails.email,"Only100Ads-Reset Password","",emailHtmlContent);
        res.status(200).json({message:"Reset Password Link sent to your email"})
      } else {
        res.status(401).json({message:"Auth failed"})
      }
    }
  });

  router.post('/resetPassword/:id',
  param('id').not().isEmpty().withMessage('must not be empty'),
  body('password').not().isEmpty().withMessage('must not be empty'),
  //query('email').not().isEmpty().withMessage('must not be empty'),
 //query('email').isEmail().withMessage('must be valid'),
  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(req.query.email);
      res.status(422).json(errors)
    } else {
      let userDetails = await usersModel.findOne({"resetId":req.params.id});//"email":req.query.email,
      if(userDetails) {
        //let resetPassword = randomstring.generate(7);
        let resetPassword = req.body.password;

        let emailHtmlContent = "<html><body><h6>Hello</h6><p>You password has been resetted.</p><p>New Password : "+resetPassword+"<p>Thank You</p></body></html>";
        let update = await usersModel.updateOne({email:req.query.email},{password:resetPassword});
        if(update){
        sendEmail("ram196kumar@gmail.com",userDetails.email,"Only100Ads-Reset Password","",emailHtmlContent);
        res.status(200).json({message:"Reset Password sent to your email - "+resetPassword})
        }

      } else {
        res.status(401).json({message:"Auth failed"})
      }
    }
  });

  router.post('/changePassword',
  body('email').not().isEmpty().withMessage('must not be empty'),
  body('email').isEmail().withMessage('must be valid'),
  body('password').not().isEmpty().withMessage('must not be empty'),
  async function (req, res, next) {
    let verifyDetails = await verifyToken(req);
    console.log("test",verifyDetails);
    if(!verifyDetails){
      res.status(401).json({message:"Auth Failed"})
    } else {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {
      let userDetails = await usersModel.findOne({"email":verifyDetails.email,"_id":verifyDetails.id});
      let comparePassword = await userDetails.comparePassword(req.body.password);
      console.log(userDetails,comparePassword);
      if(comparePassword){
        res.status(200).json({message:"New Password is same as old password"})
      } else if(userDetails) {
        let update = await usersModel.updateOne({"email":verifyDetails.email,"_id":verifyDetails.id},{password:req.body.password});
        res.status(404).json({message:"Password Updated!!!"})
      } else {
        res.status(404).json({message:"User Not found"})
      }
    }
    }
  });

  router.post('/auth',
  header('Authorization').not().isEmpty().withMessage('must not be empty'),
  header('Authorization').customSanitizer(value => {
    return value.split(" ")[1];
  }),
  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json(errors)
    } else {
      var privateKey = fs.readFileSync(path.join(__dirname,'../server.crt'));
      jwt.verify(req.headers.authorization, privateKey, { algorithms: ['RS256'] }, function(err, decoded) {
        console.log("decoded",decoded);
        console.log("err",err);

        if(err){
          res.status(401).json({message:"Failed to auth",err:err});
        }else {
        res.status(200).json({message:"Success","decoded":decoded});
        }

      });
    }
  });
  

  router.post('/validateExistingFields',
  body('key').not().isEmpty().withMessage('must not be empty'),
  body('value').not().isEmpty().withMessage('must not be empty'),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json(errors)
    } else {
      let reqParams = req.body;
      let formattedParams = {};
      formattedParams[reqParams.key] = reqParams.value;
      return usersModel.find(formattedParams).then(user => {
        console.log("user",user);
        if (user.length > 0) {
          res.status(422).json({message:reqParams.key+" already in use"})
        } else {
          res.status(200).json({message:"success"});
        }
      });
      
    }
  });

router.post('/register',
  body('email').not().isEmpty().withMessage('must not be empty'),
  body('email').isEmail().withMessage('must be valid'),
  body('password').not().isEmpty().withMessage('must not be empty'),
  body('userName').not().isEmpty().withMessage('must not be empty'),
  body('website').not().isEmpty().withMessage('must not be empty'),
  body('website').isURL().withMessage('must not be empty'),
  body('userName').custom(value => {
    return usersModel.find({userName:value}).then(user => {
      if (user.length > 0) {
        return Promise.reject(true)
      } else {
        return Promise.resolve(false);
      }
    });
  }).withMessage('Username already in use'),
  body('email').custom(value => {
    return usersModel.find({email:value}).then(user => {
      console.log("user",user);
      if (user.length > 0) {
        return Promise.reject(true)
      } else {
        return Promise.resolve(false);
      }
    });
  }).withMessage('Email already in use'),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json(errors)
    } else {
      let reqParams = req.body;
      const users = new usersModel(reqParams);
      users.save(users,function (err) {
        console.log("users",users);
        if (err) {
          res.status(400).json(err);
        }
        var privateKey = fs.readFileSync(path.join(__dirname,'../key.pem'));
        jwt.sign({ email: req.body.email ,id : users._id  }, privateKey, { algorithm: 'RS256',expiresIn: 60 * 60 } ,function(err, token) {
          if(err){
            console.log(err);
            res.status(400).json(err);
          }
          console.log(token);
        
        res.status(200).json({"token":token})
        });
      });
    }
  });


module.exports = router;
