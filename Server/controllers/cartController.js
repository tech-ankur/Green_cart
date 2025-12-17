
// Update User cartData : api/cart/update

import User from "../models/user.js";

     
export const updateCart=async(req,res)=>{
    try{
        const {cartItems}=req.body;
         const userId = req.userid;
        await User.findByIdAndUpdate(userId,{cartItems});
        res.json({success:true,message:"Cart updated successfully"})
    }   catch(error){       
        console.log(error.message);
        res.json({success:false,message:error.message})
    }   
}