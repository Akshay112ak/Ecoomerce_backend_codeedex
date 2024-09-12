var express = require('express');
var router = express.Router();
const Product=require('../model/product')
const formidable=require('formidable')
const fs=require('fs');
router.get('/addproduct', function(req, res, next) {
    res.render('addproduct');
});
router.post('/addproductverify',  function(req, res, next) {
    
    // console.log(req.body,"body")
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (err) {
          console.error('Error parsing form: ', err);
          return;
      }
      var productname=fields.productname[0];
      var description=fields.description[0];
      var price=fields.price[0];
      var category=fields.category[0];
      var stock=fields.stock[0];
      var oldpathimage = files.productphoto[0].filepath;
      var oldpathimagelarge = files.productphotolarge[0].filepath;
      console.log('Old path:', oldpathimage,"fcgvhbnj");

      var newpathimage = "E:/codeedextechnologiesecommerce/ecommerce/public/images/newimage/" + files.productphoto[0].originalFilename;
      console.log('New path:', newpathimage);
      fs.copyFile(oldpathimage, newpathimage, function (err) {
      if (err) throw err;
      {
        console.log(" not file upload 1")
      }
      console.log("file upload 1")
    });
    var newpathimagelarge = "E:/codeedextechnologiesecommerce/ecommerce/public/images/newimage/" + files.productphotolarge[0].originalFilename;
      console.log('New path:', newpathimagelarge);
      fs.copyFile(oldpathimagelarge, newpathimagelarge, function (err) {
      if (err) throw err;
      {
        console.log(" not file upload 2")
      }
      console.log("file upload 2")
    });
    
    //var image1=newpathimage;
    var newpathimage1="/images/newimage/";
    var productphoto=newpathimage1+files.productphoto[0].originalFilename;
    //var image2=newpathimagelarge;
    var newpathimagelarge1="/images/newimage/";
    var productphotolarge=newpathimagelarge1+files.productphotolarge[0].originalFilename;
     const product = new Product({
      productname,
      description,
      price,
      category,
      stock,
      productphoto,
      productphotolarge,
     });

     product.save().then(() => {
         res.redirect('landing');
     }).catch((error) => {
         console.log(error, "Error saving movie");
         res.status(500).send('Internal Server Error');
     });
});
});
router.get('/viewproduct/:id',function(req, res, next) {
  const id=req.params.id;
  Product.findById(id)
  .then(result => {
    res.render('viewproduct', { data: result});
  })
    .catch((err) =>
    {
      console.log("error back in view")
    });
});
router.post('/updateproductverify/:id',function(req, res, next) {
  const id=req.params.id;
  var form = new formidable.IncomingForm({allowEmptyFiles: true,minFileSize: 0});
    form.parse(req, function(err, fields, files) {
      if (err) {
          console.error('Error parsing form: ', err);
          
          return;
      }
      var productname=fields.productname[0];
      var description=fields.description[0];
      var price=fields.price[0];
      var category=fields.category[0];
      var stock=fields.stock[0];
      var oldpathimage = files.productphoto[0].filepath;
      var oldpathimagelarge = files.productphotolarge[0].filepath;
      if((files.productphoto[0].originalFilename=="")&&(files.productphotolarge[0].originalFilename==""))
      {
        Product.findByIdAndUpdate(id,{productname,description,price,category,stock})
        .then(result => {
           res.redirect('/landing')
        })
          .catch((err) =>
          {
            console.log("error back in update 193",err)
          });
        console.log("both null")
      }
      else if(files.productphoto[0].originalFilename=="")
      {
    var oldpathimagelarge = files.productphotolarge[0].filepath;
    var newpathimagelarge = "E:/codeedextechnologiesecommerce/ecommerce/public/images/newimage/" + files.productphotolarge[0].originalFilename;
    fs.copyFile(oldpathimagelarge, newpathimagelarge, function (err) {
      if (err) throw err;
      {
        console.log(" not file upload 204")
      }
      console.log("file upload 204")
    });
    var newpathimagelarge1="/images/newimage/";
    var productphotolarge=newpathimagelarge1+files.productphotolarge[0].originalFilename;
        Product.findByIdAndUpdate(id,{productname,description,price,category,stock,productphotolarge})
        .then(result => {
           res.redirect('/landing')
        })
          .catch((err) =>
          {
            console.log("error back in update 219",err)
          });
        console.log("image null")
      }
      else if(files.productphotolarge[0].originalFilename=="")
        {
      let oldpathimage = files.productphoto[0].filepath;
      let newpathimage = "E:/codeedextechnologiesecommerce/ecommerce/public/images/newimage/" + files.productphoto[0].originalFilename;
      
      fs.copyFile(oldpathimage, newpathimage, function (err) {
      if (err) throw err;
      {
        console.log(" not file upload 231")
      }
      console.log("file upload 231")
    });
    let newpathimage1="/images/newimage/";
    let productphoto=newpathimage1+files.productphoto[0].originalFilename
    Product.findByIdAndUpdate(id,{productname,description,price,category,stock,productphoto})
        .then(result => {
           res.redirect('/landing')
        })
          .catch((err) =>
          {
            console.log("error back in update 246",err)
          });
          console.log("photo null")
        }
        else
        {
      let oldpathimage = files.productphoto[0].filepath;
      let newpathimage = "E:/codeedextechnologiesecommerce/ecommerce/public/images/newimage/" + files.productphoto[0].originalFilename;
      
      fs.copyFile(oldpathimage, newpathimage, function (err) {
      if (err) throw err;
      {
        console.log(" not file upload 257")
      }
      console.log("file upload 257")
    });
    let newpathimage1="/images/newimage/";
    let productphoto=newpathimage1+files.productphoto[0].originalFilename
    var oldpathlarge = files.productphotolarge[0].filepath;
    var newpathimagelarge = "E:/codeedextechnologiesecommerce/ecommerce/public/images/newimage" + files.productphotolarge[0].originalFilename;
    fs.copyFile(oldpathlarge, newpathimagelarge, function (err) {
      if (err) throw err;
      {
        console.log(" not file upload 269")
      }
      console.log("file upload 269")
    });
    let newpathimagelarge1="/images/newimage/";
    let productphotolarge=newpathimagelarge1+files.productphotolarge[0].originalFilename;
    Product.findByIdAndUpdate(id,{productname,description,price,category,stock,productphoto,productphotolarge})
        .then(result => {
           res.redirect('/landing')
        })
          .catch((err) =>
          {
            console.log("error back in update 284",err)
          });
          console.log("not null 286")
        }
    });
});
router.get('/updateproduct/:id',  function(req, res, next) {
  const id=req.params.id
  Product.findById(id)
    .then(result => {
    //  console.log(result.image.slice(-10),'image');
    //  console.log(result.video.slice(17),'video');
   
      res.render('updateproduct', { data: result});
    })
      .catch((err) =>
      {
        console.log("error back in view",err)
      });
    
});
router.get('/deleteproduct/:id',function(req,res)
{
    const plid=req.params.id
    // console.log(plid,"ddj")
    Product.findByIdAndDelete(plid).then((data1) =>
        {
            // console.log(data1,"ddd")
           
            // console.log(data1,"ddd1")
            res.redirect('/landing')
        })
        .catch((err) =>
        {
          console.log("error back",err)
         
        });
    
});
module.exports = router;