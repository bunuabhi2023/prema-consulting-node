const express  = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const {auth, isAdmin, isVendor}  = require('../middlewares/Auth');
const { imageSingleUpload , imageMultiUpload, FormFelidsMulter} = require("../middlewares/multer");
const { FormPost } = require("../controllers/formController");
// Home 
router.get("/", (req, res) =>{
    res.send("Welcome to premaconsulting Backend");
});
//Admin Route//
router.post("/register-user", userController.signUp);
router.post("/login-user", userController.login);
router.get("/my-profile", auth, userController.getMyProfile);//auth
router.put("/update-user",imageSingleUpload, auth, userController.updateUser);
router.post("/forget-password",  userController.forgotPassword);
router.post("/change-password", auth, userController.updatePassword);




// form felids
router.post("/project-details",auth, FormFelidsMulter,FormPost);





module.exports = router;