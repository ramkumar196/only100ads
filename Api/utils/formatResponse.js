var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');
var hashtagModel = require('../models/hashtags');
let formatAdResponse = async function (req,adList) {

    var fullUrl = req.protocol + '://' + req.get('host');
    var formattedResponse = []
    _.forEach(adList, function(value, key) {
        let element = {};
        element.adText = value.adText;
        element.adImages = [];
        _.forEach(value.adImages, function(value, key) {
            value.image_600_400 = fullUrl+"/Ads/600X400_"+value.image;
            value.image = fullUrl+"/Ads/"+value.image;
            element.adImages.push(value);
        });
        element.userName = value.userName;
        _.filter()
        element.hashtags = value.hashtags;
        element.website = value.website;
        element.userImage = fullUrl+"/Users/"+value.profileImage;
        element.createdAt = moment(value.createdAt).format('MMMM Do YYYY, h:mm:ss a');

        formattedResponse.push(element);
      });

      return formattedResponse;


}

let formatUserResponse = async function (req,userdetails) {
  var fullUrl = req.protocol + '://' + req.get('host');
  let element = {};

      try {
        if(userdetails.profileImage) {
          _.forEach(userdetails.profileImage, function(value, key) {
            value.image = fullUrl+"/Users/"+value.image;
            element.profileImage = value;
        });
        } else {
          element.profileImage = '';
        }        
  
        if(userdetails.email)
        element.email = userdetails.email;

        if(element.profileImage && element.profileImage.image)
        element.userImage = element.profileImage.image;
        else
        element.userImage = '';

        element.website = userdetails.website;
  
        if(userdetails.userName)
        element.userName = userdetails.userName;

  } catch (error) {
    console.log(error)
  }
  
    return element;


}

let extractHastags = async function(text)
{

    var hashtags = [];

    var text = text.split(" ");
    _.forEach(text, async function(element, key) {
      if(element.charAt(0) == '#')
      {
        element = element.replace('#','');
        hashtags.push(element);

        let existing = await hashtagModel.findOne({hashtag:element})
        console.log("existing",existing);

        if(existing){
            let insertStatus = await hashtagModel.updateOne({_id:existing._id},{$inc : {'count' : 1}});
            console.log("insertStatus",insertStatus);
        } else {
            const hashtag = new hashtagModel({hashtag:element});
            let insertStatus = await hashtag.save(hashtag);
            console.log("insertStatus",insertStatus);
        }
      }
    });

    return hashtags;

}

let replaceHastags = async function(text)
{
    try
    {
    var org_text = text;
    var text = text.split(" ");

    _.forEach(text, function(element, key) {
      if(element.charAt(0) == '#')
      {
       org_text = org_text.replace(element,"<span class='hashtags'>"+element+"</span>");
      }
    });
    }
    catch(err)
    {
      //console.log(err)
    }

    return org_text;

}

module.exports = {formatAdResponse,extractHastags,replaceHastags,formatUserResponse};