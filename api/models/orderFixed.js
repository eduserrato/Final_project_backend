const mongoose =  require('mongoose');

const orderFixedSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   //product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}, // Here you are saying that the id will be the one of the Product
   // Here I might be able to add the name and stuff TRY TO DO IT
  
   // userId: {type: mongoose.Schema.Types.ObjectId, required: true},
   orderGroup: {type: String, required: true},
  // orderPriceGroup: {type: String, required: true},
   orderTotalPrice: {type: Number, required: true},
   ready: {type: Boolean, default: false},
   delivered: {type: Boolean, default: false},
   color1: {type: String,},
   color2: {type: String, }
});

module.exports = mongoose.model('OrderFixed', orderFixedSchema);