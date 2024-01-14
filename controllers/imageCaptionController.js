const ImageCaption = require('../models/imageCaption');
const { v4: uuidv4 } = require('uuid');

exports.CreateImageCatption = async (req, res) => {
    try {
      const { projectId, caption, observation, evaluation, file } = req.body;

  
      const newImageCaption = new ImageCaption({
        projectId,
        file,
        caption,
        observation,
        evaluation,
      });
  
      await newImageCaption.save();
  
      res.status(201).json(newImageCaption);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getCaptionByProjectId = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      const imageCaptions = await ImageCaption.find({ projectId });
  
      if (!imageCaptions || imageCaptions.length === 0) {
        return res.status(404).json({ message: "Image captions not found for the given projectId" });
      }
  
     
      
      const response = imageCaptions.map((imageCaption) => ({
        projectId: imageCaption.projectId,
        caption: imageCaption.caption,
        observation: imageCaption.observation,
        evaluation: imageCaption.evaluation,
        file: imageCaption.file,
      }));
  
      res.status(200).json({ data: response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.editCaptionByFile = async (req, res) => {
    try {
        const { file, projectId} = req.params;
        const { caption, observation, evaluation } = req.body;
        const existingImageCaption = await ImageCaption.findOne({ file:file, projectId:projectId });

        if (!existingImageCaption) {
            return res.status(404).json({ message: "Image caption not found for the given file" });
        }

        existingImageCaption.caption = caption || existingImageCaption.caption;
        existingImageCaption.observation = observation || existingImageCaption.observation;
        existingImageCaption.evaluation = evaluation || existingImageCaption.evaluation;

        await existingImageCaption.save();

        res.status(200).json(existingImageCaption);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

