var mongoose = require('mongoose');
const { Schema } = mongoose;

const adSchema = new Schema({
  adMedia:  Schema.Types.Mixed, // String is shorthand for {type: String}
  adText: String,
  adHtmlText: String,
  adImages: Schema.Types.Mixed,
  adStatus:Boolean,
  clientIp:String,
  createdBy: Schema.Types.ObjectId,
  hashtags: Schema.Types.Mixed
},{ timestamps: true});

adSchema.pre('save', function(next) {
    var ad = this;
    console.log(ad);

        // override the cleartext password with the hashed one
        ad.adStatus = true;
        next();
});

module.exports = mongoose.model('ads', adSchema);

