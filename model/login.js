const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type:String,
  },
  password: {
    type:String,
  },
});

const User = mongoose.model('adminlogin', adminSchema);

module.exports = User;
