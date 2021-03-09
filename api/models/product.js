const mongoose =  require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true },
    price: { type: Number, required: true },
    productImage: {type: String}, // might not be required if you dont want to ,
    bar: {type: String, required: true}, // this will be pulled from bar who posted it 
    recipe: {type: String}, // not REQUIRED
    imgUrl: {type: String, required: true}
});

module.exports = mongoose.model('Product', productSchema);