const {Router}=require("express")
const userRouter=Router();
const {z}=require("zod");
const { userModel } = require("../models/User");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const jwtSecret=process.env.JWTSECRET
const auth = require("../middleware/auth");

userRouter.post('/signup',async function(req,res){
         console.log("✅ Signup API Hit");
     console.log("✅ Signup API Hit", req.body);

    const requiresBody=z.object({
        username:z.string(),
        email:z.string().email(),
        name:z.string(),
        password:z.string()
    })

    const parsedDataWithSuccess=requiresBody.safeParse(req.body);
    if(!parsedDataWithSuccess.success)
    {
        return res.status(400).json({
            message:"Incorrect Format",
            error:parsedDataWithSuccess.error
        })
    }

    const {username,email,name,password}=parsedDataWithSuccess.data;

    try{
        const existUser=await userModel.findOne({email});
        if(existUser){
        return res.status(409).json({
            message:"User already exist.Please use another email."
        })
        }
        const hashedpassword=await bcrypt.hash(password,5);

        await userModel.create({
            username,
            email,
            name,
            password:hashedpassword
        });
        return res.status(201).json({
            message:"Signup Successful"
        })
    }
    catch(error)
    {
            console.error("Signup Error:", error);
        return res.status(500).json({
            message: "Internal server Error"
        })
    }
});

userRouter.post('/signin',async function(req,res){
    console.log("Eignin api hit");
    const {email,password}=req.body;

    const user=await userModel.findOne({
        email:email
    })
    
    if(!user)
    {
        return res.status(401).json({
            message:"User Doesn't exist."
        })
    }

    const realpassword=await bcrypt.compare(password,user.password);
    if(realpassword)
    {
        const token=jwt.sign({
            id:user._id.toString()
        },jwtSecret,{
            expiresIn:"7d"
        });
        res.json({
            token:token,
            success:true
        })
    }
    else{
        res.status(403).json({
            message:"Incorrect password."
        })
    }
})

userRouter.get('/me',auth,async function(req,res){
  try {
    const user = await userModel.findById(req.userId).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user,
        success:true
     });
  } catch (error) {
    console.error("Get Me Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
})
module.exports=userRouter