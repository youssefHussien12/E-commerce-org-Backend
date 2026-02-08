import mongoose from "mongoose";
import bcrypt from "bcrypt"


const schema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    isBlocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['user', 'admin'],
        default:'user'
    },
    passwordChangedAt:Date,
    wishlist:[{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    addresses:[{
        city:String,
        phone:String,
        street:String
    }]

}, {
    timestamps: true, versionKey: false
})


schema.pre('save',function(){
     this.password = bcrypt.hashSync(this.password, 8)
})


schema.pre('findOneAndUpdate',function(){
    if(this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 8)
})


schema.pre(/^find/,function(){
    this.populate('wishlist')
    this.populate('addresses')
})

export const User = mongoose.model('User', schema)
