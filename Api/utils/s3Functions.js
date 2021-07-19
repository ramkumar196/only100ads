var AWS = require("aws-sdk");

AWS.config.update({
  region: 'us-east-2',
  accessKeyId: '',
  secretAccessKey: '',
  
});

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});

s3 = new AWS.S3({apiVersion: '2006-03-01'});

console.log("s3",s3);

const s3Bucket = "only100adsdotcom";

function getS3Object(fileName){
    var params = {
        Bucket: s3Bucket, 
        Key: fileName, 
       };
       s3.getObject(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response
         return data;
       });
}

function putS3Object(fileContent,fileName){
    var params = {
        Body: fileContent,
        Bucket: s3Bucket, 
        Key: fileName
       };
       s3.putObject(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response

         return data;
         /*
         data = {
          ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
          VersionId: "tpf3zF08nBplQK1XLOefGskR7mGDwcDk"
         }
         */
       });
      
}

function listS3Object(fileName){
    var params = {
        Bucket: s3Bucket, 
        MaxKeys: 2
       };
       s3.listObjects(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response

         return data;
         /*
         data = {
          Contents: [
             {
            ETag: "\"70ee1738b6b21e2c8a43f3a5ab0eee71\"", 
            Key: "example1.jpg", 
            LastModified: <Date Representation>, 
            Owner: {
             DisplayName: "myname", 
             ID: "12345example25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc"
            }, 
            Size: 11, 
            StorageClass: "STANDARD"
           }, 
             {
            ETag: "\"9c8af9a76df052144598c115ef33e511\"", 
            Key: "example2.jpg", 
            LastModified: <Date Representation>, 
            Owner: {
             DisplayName: "myname", 
             ID: "12345example25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc"
            }, 
            Size: 713193, 
            StorageClass: "STANDARD"
           }
          ], 
          NextMarker: "eyJNYXJrZXIiOiBudWxsLCAiYm90b190cnVuY2F0ZV9hbW91bnQiOiAyfQ=="
         }
         */
       });
}

// Export 's3' constant.
 module.exports ={getS3Object,putS3Object,listS3Object};
