const mongoose = require("mongoose");

const imagecaptions = new mongoose.Schema(
    {
      
       projectId:{
           type:String,
           required:true,
       },
       file:{   
            type:String,
            required:false,
            maxLength:255,
       },
       caption:{   
            type:String,
            required:false,
            maxLength:5000,
       },
       observation:{   
            type:String,
            required:false,
            maxLength:5000,
       },
       evaluation:{   
            type:String,
            required:false,
            maxLength:255,
       },

    },
    {
        timestamps:true
    }
);
module.exports = mongoose.model("ImageCaption", imagecaptions);