import mongoose from "mongoose";



const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'category name must be unique'],
        trim: true,
        minLength: [2, 'category name must be at least 2 characters']
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    image: String,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }

}, {
    timestamps: true, versionKey: false
})


schema.post('init', (doc) => {
    doc.image = process.env.BASE_URL + 'categories/' + doc.image
})


export const Category = mongoose.model('Category', schema)
