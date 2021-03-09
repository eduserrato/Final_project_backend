const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// const Order = require('../models/order');
// const Product = require('../models/product');
const OrderFixed = require('../models/orderFixed');


// Handle incoming GET requests
router.get('/', (req, res, next) => {
    OrderFixed.find()
    .select("_id preparing orderGroup orderTotalPrice ready delivered color1 color2")
    //.populate('product')       // Like this it sends all the info in product
   // This I just erased //.populate('product', 'name') // Like this it just adds the name of product  ........... IMPORTANT
    .exec()
    .then(docs =>{
        console.log(docs);      // THIS CAN BE ERASED
        res.status(200).json({
            //count: docs.length,
            orders: docs.map(doc => {
                return {
                    orderId: doc._id,
                    orderGroup: doc.orderGroup,
                    //orderPriceGroup: doc.orderPriceGroup,
                    orderTotalPrice: doc.orderTotalPrice,
                    ready: doc.ready,
                    delivered: doc.delivered,
                    color1: doc.color1,
                    color2: doc.color2,
                    // request: {
                    //     type: 'GET',
                    //     url: 'http://localhost:3000/orders/' + docs._id,
                    //     description: 'See the specific order'
                    // }
                }
            })
            
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
  
    var colors = require('../models/listOfColors');
    var colorr1 = colors.randomColor();
    var colorr2 = colors.randomColor();
    console.log(colorr1);
        const order = new OrderFixed({
            _id: mongoose.Types.ObjectId(), //................Here add userId later
            orderGroup: req.body.orderGroup,
            //orderPriceGroup: req.body.orderPriceGroup,
            orderTotalPrice: req.body.orderTotalPrice,
            color1: colorr1,
            color2: colorr2,
            //userId: req.body.userId

        });
        return order.save()
    
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    orderGroup: result.orderGroup,
                    //orderPriceGroup: result.orderPriceGroup,
                    orderTotalPrice: result.orderTotalPrice,
                    ready: result.ready,
                    delivered: result.delivered,
                    color1: result.color1,
                    color2: result.color2,
                   // userId: result.userId
                },
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:orderId', (req, res, next) => {
    OrderFixed.findById(req.params.orderId)
   // .populate('product', 'name price')
    .exec()
    .then(order =>{
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', (req, res, next) => {
   OrderFixed.remove({_id: req.params.orderId})
   .exec()
   .then(
       res.status(200).json({
        message: "Order Deleted",
        // request: {
        //     type: 'POST',
        //     url: 'http://localhost:3000/orders',
        //     body: { productId: 'ID', quantity: 'Number'}
        // }
       })
   )
   .catch(err=>{
       res.status(500).json({
           error: err
       })
   });
});

router.patch('/:orderId',(req, res, next) => {
    const id = req.params.orderId;

    const updateOps = {};
    for(const ops of req.body){     // This forloop checks for the update things sent,
        updateOps[ops.propName] = ops.value;
    }
    OrderFixed.update({_id: id}, { $set: updateOps}) // Here you update the sent updates. // It doesn't add new properties
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: 'Order updated',
            // request:{
            //     type: 'GET',
            //     description: 'See the updated object',
            //     url: 'http://localhost:3000/products/'+ id
            // }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;