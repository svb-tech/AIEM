const jwt=require('jsonwebtoken')
const jwtSecret=process.env.JWTSECRET

const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization')?.replace('Bearer ','');

        if(!token)
        {
               return res.status(401).json({
                success: false,
                message: 'No token provided, access denied'
            });
        }
        const decoded=jwt.verify(token,jwtSecret);
        req.userId=decoded.id;
        next();
    
    }
    catch(error)
    {
         console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};
module.exports=auth;