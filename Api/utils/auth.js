var jwt = require('jsonwebtoken');
var fs = require('fs');
const path = require('path');
let verifyToken = async (req) =>  new Promise(function(resolve, reject) {
    var privateKey = fs.readFileSync(path.join(__dirname,'../server.crt'));
     jwt.verify(req.headers.token, privateKey, { algorithms: ['RS256'] }, function(err, decoded) {
         if(err){
            console.log("verify token ...........",err);
            resolve(false);
         } else {
            resolve(decoded);
         }
     });
});

module.exports = verifyToken;