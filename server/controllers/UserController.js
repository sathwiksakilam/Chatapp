const User = require("../models/Usermodel");
const bcrypt = require("bcrypt");

module.exports.register =  async (req,res,next) =>{
    // console.log(req.body);
    try{
        const {username,email,password} = req.body;
        const usernamecheck = await User.findOne({username});
        if(usernamecheck)
            return res.json({msg:"Username already used",status:false});
        const emailcheck = await User.findOne({email});
        if(emailcheck)
            return res.json({msg:"Email already used",status:false});
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            email,
            username,
            password:hashedPassword,
        });
        delete user.password;
        return  res.json({status:true,user});
    }
    catch(ex)
    {
        next(ex);
    }
};

module.exports.login =  async (req,res,next) =>{
    // console.log(req.body);
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user)
            return res.json({msg:"Incorrect username or password",status:false});
        const isPasswordvalid = await bcrypt.compare(password,user.password);
        if(!isPasswordvalid)
        {
            return res.json({msg:"Incorrect username or password",status:false});
        }
        delete user.password;
        return  res.json({status:true,user});
    }
    catch(ex)
    {
        next(ex);
    }
};

module.exports.setAvatar = async (req,res,next) =>{
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet :true,
            avatarImage,
        });
        return res.json({
            isSet:userData.isAvatarImageSet,
            image:userData.avatarImage,
        });
    }
    catch(ex)
    {
        next(ex);
    }
}

module.exports.getAllUsers = async (req,res,next) =>{
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const users = await User.find({_id:{$ne : userId}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    }
    catch(ex)
    {
        next(ex);
    }
}

module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };

