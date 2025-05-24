import express from 'express'
import crypto from 'node:crypto'
import { jwt } from 'jsonwebtoken';
import { UserModel } from '../model/user.model';
import { uploadMiddleWare } from '../middleware/file';
const UserRouter = express.Router();


// Generate Password For User 
const GeneratePasswordCode = (somestring) => {
    const somehash = crypto.createHash('md5').update(somestring).digest('hex').toString();
    return somehash
};

// Generate Token For User Login
const GenerateToken = async (props) => {
    const { _id, name, email, userId, profile } = props
    try {
        const token = jwt.sign({ _id: _id, name: name, email: email, userId: userId, profile: profile }, process.env.SecretKey);
        return { status: 'success', token: token }
    } catch (error) {
        return { status: 'error', error: error.message }
    }
}

// User Login 
UserRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ status: 'error', message: 'User Email & Password is Required To Login!' })
        }

        const user = UserModel.find({ email: email });
        if (user.length === 0) {
            return res.json({ status: 'error', message: 'No User Found With This Email ID!' })
        } else {
            const decodedpassword = GeneratePasswordCode(password);
            if (decodedpassword === user[0].password) {
                return res.json({ status: 'success', message: 'Login Successful', redirect: '/' })
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
            return res.json({ status: 'error', message: 'User Email & Password is Required To Login!' })
        }

        if (!req.file) {
            return res.json({ status: 'error', message: 'Profile Image is Required!' })
        }

        const user = UserModel.find({ email: email });
        if (user.length !== 0) {
            return res.json({ status: 'error', message: 'User Already Registered with this Email Id!' })
        } else {
            const decodedpassword = GeneratePasswordCode(password);
            const user = new UserModel({
                name: name,
                email: email,
                password: decodedpassword,
                score: 0,
                type: 'User'
            })
            await user.save();
            return res.json({ status: 'success', message: 'User Created Successfully!', redirect: "/login" })

        }
    } catch (error) {
        return res.json({ status: 'error', message: `User Registration Failed. Error:- ${error.message}` })
    }
})

// Admin User Login





export { UserRouter }