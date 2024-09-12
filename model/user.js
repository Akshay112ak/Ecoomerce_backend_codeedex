const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
      },
  email: {
    type:String,
  },
  password: {
    type:String,
  },
  usercart: {
    type:Array,
  },
  userwishlist: {
    type:Array,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
