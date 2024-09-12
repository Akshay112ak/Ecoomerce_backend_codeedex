var express = require('express');
var router = express.Router();
var User = require('../model/user');
const Product=require('../model/product');
const { validationResult } = require('express-validator');
const {verifyToken} = require('./validators');
var { ValidateConfirmpassword, validatePassword } = require('./validators');
var bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
  };
  router.post('/usersignup', [validatePassword, ValidateConfirmpassword], async function(req, res, next) {
    const { email, password, name } = req.body;
    const errors = req.validationErrors || [];
    const validationResultErrors = validationResult(req);

    if (!validationResultErrors.isEmpty()) {
        errors.push(...validationResultErrors.array());
    }

    if (errors.length > 0) {
        console.log(errors,"err")
        return res.status(200).json({ errors });
    } 
    try {
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(200).json({ errors: [{ msg: "Email already taken" }] });
        } else {
            const hashpassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name,
                email,
                password: hashpassword,
            });
            
            await newUser.save();
            return res.status(200).json({ message: "User registered successfully" });
        }
    } catch (error) {
        console.error(error, "Error during user registration");
         res.status(500).json({ errors: [{ msg: "Internal server error" }] });
    }

});
router.post('/userlogin',async function(req, res, next) {
    const data=req.body.data;
    const email=data.email;
    const password=data.password
      let founduser;
      User.findOne({email}).then((user) => 
      {
        if(!user)
          {
            const errors=[]
            errors.push({msg:"Incorrect Username"})
            res.status(201).json({ errors })
          }
        else
          {
            founduser=user;
             bcrypt.compare(password,user.password)
            .then(isPasswordValid =>
              {
      
                if(!isPasswordValid)
                  {
                    const errors=[]
                    errors.push({msg:"Incorrect password"})
                    return res.status(201).json({ errors })
                  }
                  else
                  {
                    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET = generateSecretKey(), { expiresIn: '1h' });
                    var data={email,token}
                    res.status(200).json({ data}); 
                  }
              }).catch(error => {
                console.error(error, "Error during user login");
                return res.status(500).json({ errors: [{ msg: "Internal server error" }] });
             
                })
            }
      });
  });


  router.get('/userproductlisting',verifyToken,async(req,res)=>
    {
      const token = req.headers.authorization;
        const { page = 1, limit = 2 } = req.query;
        const options = {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
        };
        Product.paginate({}, options).then((result)=>
        {
          // console.log("19",result.docs,"15")
          res.json({data1:result.docs,totalPages:result.totalPages,currentPage:result.page,limit:options.limit,})
        }).catch(err=>
        {
            console.log("er 17",err)
        }) 
    });

    router.post('/userproductsearch',async(req,res) =>
        {
          const { page = 1, limit = 2} = req.query;
            const options = {
              page: parseInt(page, 10),
              limit: parseInt(limit, 10),
            };
          console.log("22",req.body)
            var query=req.body.query.trim()
            console.log("query",query)
            try {
              const products = await Product.paginate({
                productname: { $regex: `^${query}`, $options: 'i' }
              },options);
           // Debug log to confirm products retrieval
             console.log(products.totalPages,"total")
              res.json({products:products.docs,totalpage:products.totalPages});
          } catch (error) {
              console.error('Error during movie search:', error); // Debug log for errors
              res.status(500).json({ message: 'Internal Server Error' });
          } 
        });

router.get('/userproductdetaileview/:id',async(req,res)=>
    {
        const id=req.params.id
           console.log("i",id)
        Product.findById(id)
        .then(result => {
            
            
            res.json({ data: [result]});
        })
            .catch((err) =>
            {
            console.log("error back in view")
            });
});
router.post('/useraddtocart',async(req,res)=>
    {
      var useremail= req.body.email;
      var productid=req.body.productid;
      var resultquey=await User.findOne({usercart:{$in:[productid]}})
      if(resultquey)
      {
        res.json({data:"already addeed"})
      }
      else{
        User.findOneAndUpdate({email:useremail},
        {$push:{usercart:productid}}
            ).then(result=>
          {
            res.json({data:"successfullyadded"})
          }).catch(err=>
            {
              console.log(err,"err")
            })

          }
            
      //       else
      // {
      //   res.json({error:"already added"})
      // }
      });  
      
      router.post('/userwishlist',async(req,res)=>
        {
          var useremail= req.body.email;
          var productid=req.body.productid;
         var resultquey=await User.findOne({userwishlist:{$in:[productid]}})
          if(resultquey)
            {
              console.log("a",resultquey)
              res.json({data:"already addeed"})
            }
          else{
            User.findOneAndUpdate({email:useremail},
            {$push:{userwishlist:productid}}
                ).then(result=>
              {
                console.log("b")
                res.json({data:"successfullyadded"})
              }).catch(err=>
                {
                  console.log(err,"err")
                })
          }
                
          //       else
          // {
          //   res.json({error:"already added"})
          // }
          });       

  module.exports = router;