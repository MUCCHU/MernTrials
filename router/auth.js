const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate')
const router = express.Router();
const cookiep = require("cookie-parser");
require('../db/conn')
const User = require('../model/userSchema')
router.use(cookiep())
router.get('/', (req, res)=>{
    res.send("Hello world: data sent from auth.js router")
})
router.post('/register', async (req, res)=>{
    const {name, email, phone, work, password, cpassword} = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error: "No field can be empty"})
    }
    try{
        const userExists = await User.findOne({ 'email': email });
        if (userExists) {
            return res.status(422).json({ "error": "A User with same email ID exists " })
        } else if (password != cpassword)
            return res.status(422).json({ "error": "Password and confirm password don't match" })
        const user = new User({ name, email, phone, work, password, cpassword })
        await user.save();
        return res.status(201).json({ message: "User registered successfully" });
        //  try{
        //      const userRegister = await user.save();
        //      if (userRegister)
        //          return res.status(201).json({ message: "User registered successfully" })
        //      else
        //          return res.status(500).json({ error: "Failed to register" })
        //  }
        //  catch(err){
        //      return res.status(500).json({ error: "Failed to register" })
        //  }
    }
    catch(err){
        console.log(err)
    }
})
router.post('/signin', async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password)
        {
            return res.status(400).json({error: "Insufficient credentials found"})
        }
        const userLogin = await User.findOne({email: email});
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password)
            if (isMatch){
                const token = await userLogin.generateAuthToken()
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now()+ 25892000000),
                    httpOnly: true
                });
                return res.json({message: "User logged in successfully"})
        }
        else
            return res.status(400).json({error: "Login error: Invalid credentials"})
        }
        else
            return res.status(400).json({ error: "Login error: Invalid credentials" })
    }
    catch(err){
        console.log(err)
    }
})

router.get('/about', authenticate ,(req, res)=>{
    res.send(req.rootUser);
})

router.get('/getdata', authenticate, (req, res)=>{
    res.send(req.rootUser)
})

router.post('/contact', authenticate ,async(req, res) => {
    try{
        const {name, email, phone, message} = req.body;
        if (!name || !email || !phone || !message){
        console.log("Error in contact form")
        return res.json({error: "Kindly fill the application form"})
        }

        const userContact = await User.findOne({ _id: req.userID});

        if(userContact){
            const usermessage = await userContact.addMessage(name, email, phone, message)
            await userContact.save();
            res.status(201).json({message: "Message sent successfully"})
        }
    }catch(err){
        console.log(err);
    }
})

router.get("/logout", (req, res)=>{
    res.clearCookie("jwtoken", {path: "/"});
    return res.send(200).json({message: "User logged off successfully!"})
})

module.exports = router;