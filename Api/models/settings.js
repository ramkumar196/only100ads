var mongoose = require('mongoose');
const { Schema } = mongoose;

const SettingSchema = new Schema({
  appName:  String, // String is shorthand for {type: String}
  appDescription: String,
},{ timestamps: true},{
    collection: 'settings'
  });

mongoose.model('settings', SettingSchema);