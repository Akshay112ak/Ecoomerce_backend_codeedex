var express = require('express');
var router = express.Router();
var Product=require('../model/product')
/* GET home page. */
const Admin=require('../model/login');
var bcrypt=require('bcrypt')
const { isAuthenticated } = require('./validators');

router.get('/signup', function(req, res, next) {
  res.render('signup',{errors:[]});
});
router.post('/signupverify', function(req, res, next) {
  const {email,password}=req.body;
        Admin.findOne({email})
        .then(existuser =>
          {
            if(existuser)
              {
                var errors=[]
                errors.push({msg:"Email already taken"})
                //console.log(errors,"show me")
                return res.render('signup',{errors})
              }
              else
              {
                console.log("hereee",bcrypt.hashSync(password,10))
                return bcrypt.hash(password,10)
              }
                
          }).then(hashpassword =>
            {
             
                const newUser = new Admin({
                  email,
                  password:hashpassword
                  });
                   newUser.save()
                  .then(() => {
                  res.render('login',{errors:[]});
                  })
                  .catch((error) => {
                  console.error(error,"saving");
                  });
            })
});
router.get('/', function(req, res, next) {
    res.render('login',{errors:[]});
});
router.get('/landing', isAuthenticated,function(req, res, next) {
  const { page = 1, limit = 2 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
  Product.paginate({}, options)
  .then(result => {
    console.log("res",result.docs)
    res.render('landing', { data: result.docs, totalPages:result.totalPages,currentPage:result.page,limit:options.limit });
  })
    .catch((err) =>
    {
      console.log("error back in view",err)
    });
  
});
router.get('/logout', function(req, res, next) {
  req.session.destroy((err) =>
    {
      if(err)
        {
          var errors=[]
          // console.log(err);
          res.send("error")
        }else{
          res.render('login',{errors});
        }
    })
});
router.post('/loginverify', function(req, res, next) {
  const {email,password}=req.body;
  let founduser;
  Admin.findOne({email}).then((user) => 
    
    {
      if(!user)
        {
          
          const errors=[]
          errors.push({msg:"Incorrect Username"})
          return res.render('login',{errors})
        }
        founduser=user;
        return bcrypt.compare(password,user.password)
    })
    .then(isPasswordValid =>
      {
        if(!isPasswordValid)
          {
        const errors=[]
        errors.push({msg:"Incorrect password"})
        return res.render('login',{errors})
          }
          req.session.userId=founduser._id;
          req.session.userEmail=founduser.email;
          res.redirect('landing');
      }).catch(error => {
        console.error(error);
      });
    
});
module.exports = router;