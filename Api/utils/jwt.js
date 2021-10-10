var fs = require('fs');
var jwt = require('jsonwebtoken');
const path = require('path');
let verifyToken = async function (req,res,next) {
    console.log("req.path",req.path);
    const nonSecurePaths = ['/users/login','/users/register','/users/resetPassword','/users/forgotPassword', '/users/validateExistingFields','/ads/list-no-auth','/hashtags/list'];
    if (nonSecurePaths.includes(req.path)) return next();
    var privateKey = fs.readFileSync(path.join(__dirname,'../server.crt'));
    let token = (req.headers.authorization)?req.headers.authorization.split(" ")[1]:"";
    console.log("token",token);
    jwt.verify(token, privateKey, { algorithms: ['RS256'] }, async function(err, decoded) {
        console.log("decoded",decoded);
        console.log("err",err);
        if(err){
          res.status(401).json({message:"Failed to auth",err:err});
        }else {
            req.userId = decoded.id;
            console.log("req.userId",req.userId);
            next();
        }
      });
}

module.exports = verifyToken;