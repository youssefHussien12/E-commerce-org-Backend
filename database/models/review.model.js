import mongoose from "mongoose";



const schema = new mongoose.Schema({
    comment: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product:{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rate: {
        type: Number,
        min: 0,
        max: 5,
    }
}, {
    timestamps: true, versionKey: false
})


schema.pre(/^find/, function () {
    this.populate('user' , "name")
})


export const Review = mongoose.model('Review', schema)
