const express  = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const { FormPost, getForm, editFormByProjectId, getlogs} = require("../controllers/formController");
const folderController = require('../controllers/folderController');
const projectController =require('../controllers/projectController');
const imageController = require('../controllers/imageCOntroller');
const tabController = require('../controllers/tabController');
const columnController = require('../controllers/columnController');
const commentController = require('../controllers/commentController');
const imageCpationController = require('../controllers/imageCaptionController');


const {auth, isAdmin, isVendor}  = require('../middlewares/Auth');
const { imageSingleUpload , imageMultiUpload, FormFelidsMulter, upload} = require("../middlewares/multer");
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
router.post("/send-otp", userController.sendOTPEmail);

//project route//
router.get("/get-project", projectController.fetchProjectDetails);
router.post("/create-folder-on-zoho", projectController.createFolderOnZoho);
router.post("/upload-image-on-zoho",  projectController.uploadImageToZoho);

// form felids
router.post("/project-details",auth, FormPost);
router.put("/edit-form/:projectId",auth, FormFelidsMulter,editFormByProjectId);
router.get("/get-form/:projectId",auth, getForm );
router.get("/get-form/:projectId/:fieldName",auth, getlogs );


//folder Route//
router.post("/add-folder", auth, folderController.addFolder);
router.post("/add-root-folder", auth, folderController.createRootFolder)
router.get("/get-folders-by-folder/:id", auth, folderController.getFolderByFolderId);
router.get("/get-root-folder/:id", auth, folderController.getRootFolder);

//image route//
router.post("/upload-images", auth, imageController.uploadImagesController);

//Tab route//
router.post("/create-column", auth, columnController.createColumn);

//Tab route//
router.post("/create-comment", auth, commentController.createComment);
router.get("/get-comments/:projectId/:fieldName", commentController.getComment);


//Image Caption Route//
router.post("/create-imagecaption", auth,  imageCpationController.CreateImageCatption);
router.get("/get-caption-by-project/:projectId", auth, imageCpationController.getCaptionByProjectId);
router.put("/edit-caption/:file/:projectId", auth, imageCpationController.editCaptionByFile);

module.exports = router;