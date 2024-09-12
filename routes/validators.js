const isAuthenticated = (req,res,next) =>{
  if(req.session && req.session.userEmail)
    {
      return next();
    }
    res.redirect('/')
}
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log("token 97 custom",);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing token' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
    console.log("kfk",req.userId)
    req.userId = decoded.userId;
    next();
  });
};
const ValidateConfirmpassword = (req,res,next) =>{
  const confirm=req.body.confirmpassword;
  const password = req.body.password;
  const errors=[];

  if(!isvalidConfirmpassword(confirm,password))
    {
      errors.push({msg:"password and confirm password doesn't match"})
    }
  req.validationErrors = req.validationErrors || [];
  req.validationErrors.push(...errors);
  next();
}

// Custom validation middleware for password
const validatePassword = (req, res, next) => {
  const password = req.body.password;
  console.log('password not get',password,typeof(password))
  const errors = [];

  if (!isValidPassword(password)) {
    errors.push({ msg: 'Password must meet certain criteria' });
  }

  // Assign the errors to req.validationErrors
  req.validationErrors = req.validationErrors || [];
  req.validationErrors.push(...errors);

  next();
  console.log(req.validationErrors,"hi 45 custom")
};

const isValidPassword = (password) => {
  // Implement your custom password validation logic here
  // Example: Check if the password is at least 8 characters long
  return password.length >= 8;
};

const  isvalidConfirmpassword = (confirm,password) =>
  {
    return password==confirm;
  }
module.exports = {isAuthenticated,verifyToken,validatePassword,ValidateConfirmpassword};