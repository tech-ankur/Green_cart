import jwt from 'jsonwebtoken';
const authUser=(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return res.json({success:false,message:'Not authorized'});
    }
    try{
      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecoded.id){
            req.userid=tokenDecoded.id;
        }
        else {
            return res.json({success:false,message:'Not authorized'});
        }
        
        next();
    }catch(error){
        return res.json({success:false,message:'Not authorized'});
    }

}
export default authUser;