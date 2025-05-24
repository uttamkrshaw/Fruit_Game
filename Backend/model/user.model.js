import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true,
        trim: true
    },
    score: {
        type: Number,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    }
})

const UserModel = mongoose.model('users', UserSchema)

export { UserModel }