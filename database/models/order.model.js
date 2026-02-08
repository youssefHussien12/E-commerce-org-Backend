import mongoose from "mongoose";



const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    orderItems: [
        {
            product: { type: mongoose.Types.ObjectId, ref: "Product" },
            quantity: Number,
            price: Number
        }
    ],
    totalOrderPrice: Number,
    shippingAddress:{
        city:String,
        phone:String,
        street:String
    },
    paymentType:{
        type:String,
        enum:['cash', 'card'],
        default:'cash'
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:Date,
    isDelivered:{
        type:Boolean,
        default:false
    },
    deliveredAt:Date
}, {
    timestamps: true, versionKey: false
})


export const Order = mongoose.model('Order', schema)
