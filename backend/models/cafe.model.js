const mongoose = require("mongoose");

const CafeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false // Google ile giriş yapanlarda olmayacak
    },
    logo: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
    },
    template: {
        type: String,
        enum: ["scroll", "category", "horizontal"],
        default: "scroll"
    },
    googleId: {
        type: String,
        default: null,
        unique: true,
        sparse: true // sadece bazı kayıtlarda olur, boş olanlar hata vermez
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    avatar: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Cafe", CafeSchema);
