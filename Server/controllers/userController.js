//register user:/api/user/register

import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register=async (req,res)=>{
   try{
    const {name,email,password}=req.body;
    if(!name||!email||!password){
        return res.status(400).json({message:"All fields are required"});
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
   const user=await User.create({name,email,password:hashedPassword});
   const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
   res.cookie('token',token,{
    httpOnly:true,//prevent client side js access
    secure:process.env.NODE_ENV==='production',//only send cookie over https
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    maxAge:7*24*60*60*1000//cookie expiry 7 days
   })
   return res.json({success:true ,message:"User registered successfully",user:{
    email:user.email,
    name:user.name,}})
   }catch(error){
    console.log(error.message);
    res.json({success:false,message:error.message})
   }
}

//login user :/api/user/login

export const login=async (req,res)=>{
    try{
  const  {email,password}=req.body

    if(!email||!password){
       return  res.json({success:false,message:'Emails and password are required'})
    }
    const user=await User.findOne({email});
    if(!user){
     return    res.json({success:false,message:'Invalid email or password'})
    }
    
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
       return  res.json({success:false,message:'Invalid email or password'})
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
     
    res.cookie('token',token,{
        httpOnly:true,//prevent client side js access
        secure:process.env.NODE_ENV==='production',//only send cookie over https
       sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        maxAge:7*24*60*60*1000//cookie expiry 7 days
       })
       return res.json({success:true,user:{
        email:user.email,
        name:user.name,}})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
  
}

//check Auth:/api/user/is-auth

export const isAuth = async (req, res) => {
  try {
    const userid = req.userid;
    const user = await User.findById(userid).select('-password');
    return res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//logout user:/api/user/logout

 export const logout=async (req,res)=>{ 
    try{  
        res.cookie('token','',{
            httpOnly:true,
            expires:new Date(0),
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        });
        return res.json({success:true,message:'Logged out'});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }}