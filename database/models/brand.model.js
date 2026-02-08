import mongoose from "mongoose";



const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'brand name must be unique'],
        trim: true,
        minLength: [2, 'brand name must be at least 2 characters']
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    logo: String,
     createdBy:{
            type:mongoose.Types.ObjectId,
            ref:'User',
        }

}, {
    timestamps: true, versionKey: false
})




schema.post('init',(doc)=>{
    doc.logo = process.env.BASE_URL + 'brands/' + doc.logo
})


export const Brand = mongoose.model('Brand', schema)
