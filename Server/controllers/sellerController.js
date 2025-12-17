//login seller :/api/seller/login
import jwt from 'jsonwebtoken';
export const sellerLogin=async (req,res)=>{
     try{ 
        const {email,password}=req.body;
    if(!email||!password){
        return res.json({success:false,message:'Email and password are required'});
    }  
  
         if(email===process.env.SELLER_EMAIL && password===process.env.SELLER_PASSWORD){
        const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('sellerToken',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'NONE':'strict',
            maxAge:7*24*60*60*1000
        });
        return res.json({success:true,message:'Seller logged in successfully'});
     }
     else{
        return res.json({success:false,message:'Invalid seller credentials'});
     }
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }

}
//api//seller/is-auth
export const isSellerAuth=async (req,res)=>{
    try{
       
        return res.json({success:true});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//logout user:/api/seller/logout

 export const sellerLogout=async (req,res)=>{ 
    try{  
        res.cookie('sellerToken','',{
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