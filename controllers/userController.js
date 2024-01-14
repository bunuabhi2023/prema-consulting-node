const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require("dotenv").config();
const User = require('../models/user.js');
exports.signUp = async (req, res) => {
    try {
      const { name, email, mobile, password, designation } = req.body;
      const empId = `EMP${Date.now()}`;
      // Check if the email or mobile already exists in the database
      const existingUser = await User.findOne({
        $or: [{ email }, { mobile }],
      });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email or mobile already exists' });
      }
  
      // Hash the password before saving it to the database
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create the new customer object with the hashed password
      const newUser = new User({
        empId,
        name,
        email,
        mobile,
        password: hashedPassword,
        designation,
        email_otp: null,
        mobile_otp: null,
        latitude: null,
        longitude: null,
        mobile_verified_at: null,
        email_verified_at: null,
        file: null,
        city: null,  
        pincode: null,
        address: null,
      });
  
      // Save the new customer to the database
      await newUser.save();
  
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during customer signup:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
  exports.login = async (req,res) => {
    try {

        //data fetch
        const {email, password} = req.body;
        //validation on email and password
        if(!email || !password) {
            return res.status(400).json({
                success:false,
                message:'PLease fill all the details carefully',
            });
        }

        //check for registered user
        let user = await User.findOne({email});
        //if not a registered user
        if(!user) {
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            });
        }
        console.log(user._id)

        const payload = {
            email:user.email,
            _id:user._id,
            role:user.role,
        };
        //verify password & generate a JWT token
        if(await bcrypt.compare(password,user.password) ) {
            //password match
            let token =  jwt.sign(payload, 
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"15d",
                                });

                                
            // Save the updated user record
            await user.save();
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date( Date.now() + 15 * 24 * 60 * 60 * 1000),
                httpOnly:true,
                sameSite: 'none',
                secure: true,
            }

            

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'User Logged in successfully',
            });
        }
        else {
            //passwsord do not match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });

    }
}
exports.getMyProfile = async (req, res) => {
  try {
    const authenticatedUser = req.user;

    const userId = authenticatedUser._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.updateUser = async(req,res) =>{
 
    const { name, email, mobile, designation, city, state, pincode, address} = req.body;

    const file = req.s3FileUrl;
    const authenticatedUser = req.user;

    const userId = authenticatedUser._id;

    try {
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      
      const duplicateUser = await User.findOne({
        $and: [
          { _id: { $ne: existingUser._id } }, 
          { $or: [{ email }, { mobile }] }, 
        ],
      });

      if (duplicateUser) {
        return res.status(400).json({ error: 'Email or mobile already exists for another user' });
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, mobile, designation, file, city, state, pincode,address, updatedAt: Date.now() },
        { new: true }
      );

      console.log(updatedUser); // Add this line for debug logging
      res.json(updatedUser);
    } catch (error) {
      console.error(error); // Add this line for debug logging
      return res.status(500).json({ error: 'Failed to update User' });
    }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      console.log(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete User' });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email, newPassword, confirmPassword, otp } = req.body;

  try {
    const user = await User.findOne({ email:email });


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const savedOtp = user.mobile_otp;

    if(otp != savedOtp){
      return res.status(404).json({ message: 'Wrong Otp Entered' });
    }

    if(newPassword != confirmPassword){
      return res.status(400).json({ message: 'New Password and COnfirm Password is mismatch' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.save();

    return res.status(200).json({ message: 'Password Reset Successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const authenticatedUser = req.user;

  const userId = authenticatedUser._id; // Assuming you have user information in req.user

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    // Validate the new password and confirmation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the user document
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error during password update:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.sendOTPEmail = async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
      return res.status(404).json({message:"Email Not registerd with Us"});
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: "webienttechenv@gmail.com",
            pass: "ljxugdpijagtxeda",
        },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'OTP for Set Password',
      text: `Your OTP for Set Password is: ${otp}`,
    };

   const mailsent = await transporter.sendMail(mailOptions);
   if(mailsent){
    user.mobile_otp = otp;
    await user.save();
    return res.status(200).json({message:"Otp sent to your email id."});
   }
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};
  