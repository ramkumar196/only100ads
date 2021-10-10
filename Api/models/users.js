var mongoose = require('mongoose');
const { Schema } = mongoose;
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  email:  String, // String is shorthand for {type: String}
  password: String,
  userName: String,
  resetId: String,
  website:String,
  profileImage:Schema.Types.Mixed

},{ timestamps: true});

userSchema.pre('save', function(next) {
    var user = this;
    console.log(user);
    console.log(user.isModified('password'));

// only hash the password if it has been modified (or is new)
if (!user.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});
});

userSchema.pre('updateOne', function(next) {
    var user = this;
    const password = this.getUpdate().password;
    if (!password) {
        return next();
    }
// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(user.getUpdate().password, salt, function(err, hash) {
        if (err) return next(err);
        // override the cleartext password with the hashed one
        user.getUpdate().password = hash;
        next();
    });
});
});



userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log(await bcrypt.compareSync(candidatePassword, this.password));
    } catch (error) {
        console.log(error);
    }
    
    return await bcrypt.compareSync(candidatePassword, this.password);

    
};

module.exports = mongoose.model('users', userSchema);

