import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.SECRET; 
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const register = async (req, res)=>{
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json('please enter all the details');
        }
        const existingUser = await User.findOne({email});
        if(existingUser) return res.json('user already exists');

        await User.create({
            name,
            email,
            password:await bcrypt.hash(password,10)
        });
        console.log('user registered successfully');
        res.json('user registered successfully');

    }catch(err){
        res.json({error:err.message});
    }
};

export const login = async (req,res)=>{
    try{
        const {email,  password} = req.body;

        const user =  await User.findOne({email});
        if(!user) return res.status(400).json('user not found');

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json('invalid credentials');

        const payload = {userId: user._id};

        const accessToken = jwt.sign(payload, SECRET,{
            expiresIn:'1m'
        });

        const refreshToken = jwt.sign(payload, REFRESH_SECRET,{
            expiresIn:'7d'
        });

        res.json({accessToken, refreshToken});
    }catch (err){
        res.ststus(500).json({message: "Server error"});
    }
};

export const refreshToken = async (req, res)=>{
    try{
        const {refreshToken}= req.body;

        if(!refreshToken){
            return res.status(401).json('no Refresh Token');
        }

        jwt.verify(refreshToken, REFRESH_SECRET, (err,decodedUser)=>{
            if(err) return res.status(403).json('invalid refresh token');

            const payload =  {userId: decodedUser.userId};
            const newToken= jwt.sign(payload, SECRET,{
                expiresIn:'1m'
            });
            res.json({accessToken:newToken});
        });
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
};