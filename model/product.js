const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  productname:
  {
    type:String,
  },
  description:
  {
    type:String,
  },
  price:
  {
    type:Number,
  },
  category:
  {
    type:String,
  },
  productphoto:
  {
    type:String,
  },
  productphotolarge:
  {
    type:String,
  },
  stock:
  {
    type:String,
  },
});
productSchema.plugin(mongoosePaginate);
const product = mongoose.model('product', productSchema);

module.exports = product;
