import mongoose from "mongoose";
import { Types } from "mongoose";



const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'subcategory name must be unique'],
        trim: true,
        minLength: [2, 'subcategory name must be at least 2 characters']
    },
    slug:{
        type:String,
        required:true,
        lowercase:true
    },
    category: {
        type:Types.ObjectId,
        ref: 'Category'
    },
     createdBy:{
            type:Types.ObjectId,
            ref:'User',
        }

}, {
    timestamps: true, versionKey: false
})


export const SubCategory = mongoose.model('SubCategory', schema)
