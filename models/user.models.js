const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required:true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: [{
        street: String,
        city: String,
        state: String,
        postalCode: String,
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);
