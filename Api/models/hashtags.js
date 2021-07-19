var mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  hashtag:  String, // String is shorthand for {type: String}
  count: { type: Number}
},{ timestamps: true});

module.exports = mongoose.model('hashtags', userSchema);

