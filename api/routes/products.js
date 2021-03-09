const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        console.log('Couldnt save image ')
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {                    //This is putting a limit to the size of the file
        fileSize: 1024*1024*10
    },
    fileFilter: fileFilter

});


const Product = require('../models/product'); // Here I am calling the product item product.js

router.get('/',(req, res, next)=>{
 
    Product.find()
    .select("name price _id productImage recipe bar imgUrl") // This is to only look show those things instead of any other, _v: 0 example....
    .exec()
    .then(docs =>{

        const response = {
            count: docs.length,
            products: docs.map (doc=>{  // Here you are usic docs to create doc, a single one that uses docs
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    bar: doc.bar,
                    recipe: doc.recipe,
                    _id: doc._id,
                    imgUrl: doc.imgUrl,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
            
        };
        console.log(docs);  // This can be erased so this doesn't aprear on the console
        // if (docs.length >= 0) {     // This could be used in order to say when the database is empty.
        res.status(200).json(response);
        // } else {
        //      res.status(404).json({
        //          message: 'No entries found', ' The array is empty'
        //     });
        // }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// router.post('/', checkAuth, upload.single('productImage'),(req, res, next)=>{
router.post('/', upload.single('productImage'),(req, res, next)=>{

    console.log (req.file);   // This is not needed I just puted it to see the image that was sent info
     const product = new Product({
         _id: new mongoose.Types.ObjectId(),
         name: req.body.name,
         price: req.body.price,
         //productImage: req.file.path,
         bar: req.body.bar,
         recipe: req.body.recipe,
         imgUrl: req.body.imgUrl,

     }); 
     product
     .save()
     .then(result => {
         console.log(result);
         res.status(201).json({
             message: 'Created product succesfully',
             createdProduct: {
                 name: result.name,
                 price: result.price,
                 bar: result.bar,
                 recipe: result.recipe,
                 _id: result._id,
                 imgUrl: result.imgUrl,
                 request: {
                     type: 'GET',
                     url: 'http://localhost:3000/products/' + result._id
                 }
             }
         });
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({
             error: err
         });
     });

});

router.get('/:productId',(req, res, next) => {
    
    // if (id === 'special'){            // This was the dummy code that didnt to much
    //     res.status(200).json({
    //         message: 'You discovered special ID',
    //         id: id
    //     });
    // }
    // else{
    //     res.status(200).json({
    //         message: 'You passed an ID'
    //     });
    // }
    const id = req.params.productId;

    Product.findById(id)
    .select('name price _id productImage recipe bar imgUrl')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all the products', // this is not needed but it describes what it does.
                    url: 'http://localhost:3000/products/',
                }
            });
        } else{
            res.status(404).json({message: 'Not Valid entry for provided ID'})
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productId',(req, res, next) => {
    const id = req.params.productId;

    const updateOps = {};
    for(const ops of req.body){     // This forloop checks for the update things sent,
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps}) // Here you update the sent updates. // It doesn't add new properties
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: 'Product updated',
            request:{
                type: 'GET',
                description: 'See the updated object',
                url: 'http://localhost:3000/products/'+ id
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:productId',(req, res, next) => {
    const id = req.params.productId;

    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                description: 'Here you can create a product', // Not needed
                body: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;