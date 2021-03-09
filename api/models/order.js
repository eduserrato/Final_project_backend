const mongoose =  require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}, // Here you are saying that the id will be the one of the Product
   // Here I might be able to add the name and stuff TRY TO DO IT
   preparing: {type: Boolean, default: false},
   ready: {type: Boolean, default: false},
   delivered: {type: Boolean, default: false},
    quantity: { type: Number, default: 1, default: 1}  // if the dont send a quantity it will be 1
});

module.exports = mongoose.model('Order', orderSchema);