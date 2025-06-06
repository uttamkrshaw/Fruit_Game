import express from 'express'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken';
import { UserModel } from '../model/user.model.js';
import { uploadMiddleWare } from '../middleware/file.js';
import { AdminAuthentication } from '../middleware/admin.js';
import { UserAuthentication } from '../middleware/user.js';
const UserRouter = express.Router();


// Generate Password For User 
const GeneratePasswordCode = (somestring) => {
    const somehash = crypto.createHash('md5').update(somestring).digest('hex').toString();
    return somehash
};

// Generate Token For User Login
const GenerateToken = async (props) => {
    const { _id, name, email, profile, score, type } = props
    try {
        const token = jwt.sign({ _id: _id, name: name, email: email, profile: profile, score: score, type: type }, process.env.SecretKey);
        return { status: 'success', token: token }
    } catch (error) {
        return { status: 'error', error: error.message }
    }
}

// User & Admin Login 
UserRouter.post('/login', async (req, res) => {
    const { email, password } = req?.body;
    try {
        if (!email || !password) {
            return res.json({ status: 'error', message: 'User Email & Password is Required To Login!' })
        }

        const user = await UserModel.find({ email: email, disabled: false });

        if (user.length === 0) {
            return res.json({ status: 'error', message: 'No User Found With This Email ID!' })
        } else {
            const decodedpassword = GeneratePasswordCode(password);
            if (decodedpassword === user[0].password) {
                const token = await GenerateToken({ _id: user[0]._id, name: user[0].name, email: user[0].email, profile: user[0].profile, type: user[0].type })
                const userdetails = { _id: user[0]._id, name: user[0].name, email: user[0].email, profile: user[0].profile, score: user[0].score }
                return res.json({ status: 'success', message: 'Login Successful', redirect: `/dashboard/${user[0].type.toLowerCase()}`, token: token?.token, type: user[0]?.type, user: userdetails })
            } else {
                return res.json({ status: 'error', message: 'Wrong Password' })
            }
        }
    } catch (error) {
        return res.json({ status: 'error', message: `User Login Failed. Error:- ${error.message}` })
    }
})

// User Registeration
UserRouter.post('/register', uploadMiddleWare.single('profile'), async (req, res) => {

    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.json({ status: 'error', message: 'User Email & Password is Required To Registered!' })
        }

        if (!req.file) {
            return res.json({ status: 'error', message: 'Profile Image is Required!' })
        }

        const user = await UserModel.find({ email: email });
        if (user.length !== 0) {
            return res.json({ status: 'error', message: 'User Already Registered with this Email Id!' })
        } else {
            const decodedpassword = GeneratePasswordCode(password);
            const user = new UserModel({
                name: name,
                email: email,
                password: decodedpassword,
                score: 0,
                type: 'User',
                profile: req.file?.location
            })
            await user.save();
            return res.json({ status: 'success', message: 'User Created Successfully!', redirect: "/login" })
        }
    } catch (error) {
        return res.json({ status: 'error', message: `User Registration Failed. Error:- ${error.message}` })
    }
})


// User Details
UserRouter.get('/me', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token, process.env.SecretKey)
    try {
        return res.json({ status: 'success', data: decoded })
    } catch (error) {
        return res.json({ status: 'error', message: `Failed To Fetch User Details. Error:- ${error.message}` })
    }
})

// User Edit Details 
UserRouter.patch('/edit/me', UserAuthentication, uploadMiddleWare.single('profile'), async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedDetails = jwt.verify(token, process.env.SecretKey);
    try {
        const user = await UserModel.find({ _id: decodedDetails._id });
        if (user.length === 0) {
            return res.json({ status: 'error', message: `No User Found With This ID!` })
        }
        let updatedData = {};
        updatedData.name = req.body?.name || user[0].name;
        updatedData.email = req.body?.email || user[0].email;
        updatedData.profile = req.file?.location || user[0].profile;

        const updatedUser = await UserModel.findByIdAndUpdate(decodedDetails._id, updatedData, { new: true });
        return res.json({ status: 'success', message: `User Details Updated Successfully!` })
    } catch (error) {
        return res.json({ status: 'error', message: `Failed To Update User Detail's. Error:- ${error.message}` })
    }
})

// User Score Details
UserRouter.get('/list', UserAuthentication, async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token, process.env.SecretKey);
    try {
        const user = await UserModel.find({ _id: decoded._id, disabled: false });
        if (user.length === 0) {
            return res.json({ status: 'error', message: 'No User Found!' })
        } else {
            return res.json({ status: 'success', data: user[0].score })
        }
    } catch (error) {
        return res.json({ status: 'error', message: 'Failed To Fetch User Score!' })
    }
})

// Listing All User Based On Score
UserRouter.get('/listall', UserAuthentication, async (req, res) => {
    try {
        const user = await UserModel.find({ disabled: false, type: 'User' }, { password: 0 }).sort({ score: -1 })
        if (user.length === 0) {
            return res.json({ status: 'error', message: `No Active User Found!` })
        }
        return res.json({ status: 'success', data: user })
    } catch (error) {
        return res.json({ status: 'error', message: `Failed To Update User Detail's. Error:- ${error.message}` })
    }
})

// Admin Routes

// Edit User Details
UserRouter.patch('/edit/:id', AdminAuthentication, uploadMiddleWare.single('profile'), async (req, res) => {    
    try {
        const user = await UserModel.find({ _id: req.params?.id });
        if (user.length === 0) {
            return res.json({ status: 'error', message: `No User Found With This ID!` })
        }
        let updatedData = {};
        updatedData.name = req.body?.name || user[0].name;
        updatedData.email = req.body?.email || user[0].email;
        updatedData.profile = req.file?.location || user[0].profile;

        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        return res.json({ status: 'success', message: `User Details Updated Successfully!` })
    } catch (error) {
        return res.json({ status: 'error', message: `Failed To Update User Detail's. Error:- ${error.message}` })
    }
})

// Block User
UserRouter.patch('/block/:id', AdminAuthentication, async (req, res) => {
    try {
        const user = await UserModel.find({ _id: req.params?.id });
        if (user.length === 0) {
            return res.json({ status: 'error', message: `No User Found With This ID!` })
        }
        const updatedUser = await UserModel.findByIdAndUpdate(req.params?.id, { disabled: true }, { new: true });        
        return res.json({ status: 'success', message: `User Account Blocked Successfully!` })
    } catch (error) {
        return res.json({ status: 'error', message: `Failed To Block User Account. Error:- ${error.message}` })
    }
})


// UnBlock User
UserRouter.patch('/unblock/:id', AdminAuthentication,async (req, res) => {
    try {
        const user = await UserModel.find({ _id: req.params?.id });
        if (user.length === 0) {
            return res.json({ status: 'error', message: `No User Found With This ID!` })
        }
        const updatedUser = await UserModel.findByIdAndUpdate(req.params?.id, { disabled: false }, { new: true });
        return res.json({ status: 'success', message: `User Account UnBlocked Successfully!` })
    } catch (error) {
        return res.json({ status: 'error', message: `Failed To UnBlock User Account. Error:- ${error.message}` })
    }
})


// Listing All User Based On Score
UserRouter.get('/listall/admin', AdminAuthentication, async (req, res) => {
    try {
        const user = await UserModel.find({ type: 'User' }, { password: 0 }).sort({ score: -1 })
        if (user.length === 0) {
            return res.json({ status: 'error', message: `No Active User Found!` })
        }
        return res.json({ status: 'success', data: user })
    } catch (error) {
        return res.json({ status: 'error', message: `Failed To Update User Detail's. Error:- ${error.message}` })
    }
})



export { UserRouter }