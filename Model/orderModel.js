const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderno:{
        type:Number
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items: [
        {
            product: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'products'
            },
            price: {
                type:Number,
                default:0
            },
            quantity: {
                type:Number
            },
            productStatus: {
                type:String,
                enum:["Pending", "Shipped", "Delivered", "Cancelled", "Returned"],
                default:'Pending'
            },
            deliveryDate:{
                type:Date,
                default:null
            }
        }
    ],
    totalPrice: {
        type:Number,
        default:0
    },
    status: {
        type:String,
        enum:["Pending", "Shipped", "Delivered", "Cancelled", "Returned"],
        default:'Pending'
    },
    billingDetails: {
        name:String,
        email:String,
        phone:String,
        address:String,
        pincode:String,
        country:String,
        state:String,
        city:String
    },
    paymentMethod: {
        type:String,
        default:'COD'
    },
    paymentStatus: {
        type:String,
    },
    orderDate: {
        type:Date,
        default:Date.now()
    },
    returnDate:{
        type:Date
    },
    returnReason: {
        type:String
    },
    coupon:{
        type:String
    },
    discount:{
        type:Number,
        default:0
    }
},{timestamps:true})

orderSchema.statics.getNextOrderNumber = async function() {
    const lastOrder = await this.findOne().sort({ orderno: -1 }); 
    return lastOrder ? lastOrder.orderno + 1 : 1; 
};

module.exports= mongoose.model('Order', orderSchema)