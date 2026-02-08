import mongoose from "mongoose";



const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: [true, 'product name must be unique'],
        trim: true,
        minLength: [2, 'product name must be at least 2 characters']
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        minLength: 30,
        maxLength: 2000
    },
    imageCover: String,
    images: [String],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    priceAfterDiscount: {
        type: Number,
        required: true,
        min: 0
    },
    sold: Number,
    stock: {
        type: Number,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    rateAvg: {
        type: Number,
        min: 0,
        max: 5
    },
    rateCount: Number,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true, versionKey: false, toJSON: { virtuals: true }, id: false
})





schema.virtual('Reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
})




schema.pre('findOne', function () {
    this.populate('Reviews')
})


schema.post('init', (doc) => {
    if (doc.imageCover) doc.imageCover = process.env.BASE_URL + 'products/' + doc.imageCover
    if (doc.images) doc.images = doc.images.map(img => process.env.BASE_URL + 'products/' + img)
})


export const Product = mongoose.model('Product', schema)
