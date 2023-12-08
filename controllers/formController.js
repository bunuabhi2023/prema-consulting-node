const FieldForm = require("../models/fieldForm");
const Log = require("../models/log");

exports.FormPost = async (req, res) => {
  try {
    const s3FileUrls = req.files;
    let data = req.body;
    
    if (data?.interviewee) {
      data.interviewee = JSON.parse(data.interviewee);
      data.interviewee = data?.interviewee.map((interviewee, index) => ({
        ...interviewee,
        businessCardBack: (s3FileUrls['businessCardBack[]'] && s3FileUrls['businessCardBack[]'][index]?.filename) || null,
        businessCardFront: (s3FileUrls['businessCardFront[]'] && s3FileUrls['businessCardFront[]'][index]?.filename) || null,
        document: (s3FileUrls['document[]'] && s3FileUrls['document[]'][index]?.filename) || null,
      }));
    }

    if (data?.propertyStructure) data.propertyStructure = JSON.parse(data.propertyStructure);
    if (data?.interviewStructure) data.interviewStructure = JSON.parse(data.interviewStructure);
    if (data?.docOverView) data.docOverView = JSON.parse(data.docOverView);
    if (data?.floodData) data.floodData = JSON.parse(data.floodData);

    data.userId = req.user._id;
    const form = new FieldForm(data);

    const savedForm = await form.save();

    const projectId = req.body.projectId;

    const fieldsToLog = [
      "scopeFromReceivedDocuments",
      "scopeFromInterview",
      "propertyAppraiserRecord",
      "permitInformation", 
      "topographicMap", 
      "propertyPurchesTime", 
      "dolPerInterviewee", 
      "interviewRecord", 
      "interiorDamageSketch", 
      "roofSketch", 
      "lightningStrikeData", 
      "aerialImageNotes", 
      "realtorImageNotes", 
      "googleOrBingImageNotes", 
      "zillowImageNotes", 
      "redfinImageNotes", 
      "soilData"
    ];

    for (const field of fieldsToLog) {
      const fieldValue = data[field];
      const logRecord = new Log({
        userId: req.user._id,
        projectId,
        fieldName: field,
        fieldValue,
      });
      await logRecord.save();
    }

     // Create log records for sowStatement keys
    const sowStatement = JSON.parse(data.sowStatement || '{}');
    for (const key in sowStatement) {
      const fieldValue = sowStatement[key];
      const fieldName = `sowStatement${key}`;
      const logRecord = new Log({
        userId: req.user._id,
        projectId,
        fieldName,
        fieldValue,
      });
      await logRecord.save();
    }

    const propertyStructureString = data.propertyStructure || '[]';
  
    for (let index = 0; index < propertyStructureString.length; index++) {
      const obj = propertyStructureString[index];
      for (const key in obj) {
        const fieldValue = obj[key];
        const fieldName = `propertyStructure${index + 1}${key}`;
        const logRecord = new Log({
          userId: req.user._id,
          projectId,
          fieldName,
          fieldValue,
        });
        await logRecord.save();
      }
    }  
    
    const intervieweeString = data.interviewee || '[]';
  
    for (let index = 0; index < intervieweeString.length; index++) {
      const obj = intervieweeString[index];
      for (const key in obj) {
        const fieldValue = obj[key];
        const fieldName = `interviewee${index + 1}${key}`;
        const logRecord = new Log({
          userId: req.user._id,
          projectId,
          fieldName,
          fieldValue,
        });
        await logRecord.save();
      }
    }

    const docOverViewString = data.docOverView || '[]';
  
    for (let index = 0; index < docOverViewString.length; index++) {
      const obj = docOverViewString[index];
      for (const key in obj) {
        const fieldValue = obj[key];
        const fieldName = `docOverView${index + 1}${key}`;
        const logRecord = new Log({
          userId: req.user._id,
          projectId,
          fieldName,
          fieldValue,
        });
        await logRecord.save();
      }
    }
     
    const weatherData = JSON.parse(data.weatherData || '{}');
    for (const key in weatherData) {
      const fieldValue = weatherData[key];
      const fieldName = `weatherData${key}`;
      const logRecord = new Log({
        userId: req.user._id,
        projectId,
        fieldName,
        fieldValue,
      });
      await logRecord.save();
    }

    const floodDataString = data.floodData || '[]';
  
    for (let index = 0; index < floodDataString.length; index++) {
      const obj = floodDataString[index];
      for (const key in obj) {
        const fieldValue = obj[key];
        const fieldName = `floodData${index + 1}${key}`;
        const logRecord = new Log({
          userId: req.user._id,
          projectId,
          fieldName,
          fieldValue,
        });
        await logRecord.save();
      }
    }


    const interviewStructureString = data.interviewStructure || '[]';

    for (let i = 0; i < interviewStructureString.length; i++) {
      const obj = interviewStructureString[i];
      processNestedStructure(`interviewStructure${i + 1}`, obj, projectId);
    }

    function processNestedStructure(prefix, obj, projectId) {
      for (const key in obj) {
        const value = obj[key];

        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            const newPrefix = `${prefix}${key}${index + 1}`;
            processNestedStructure(newPrefix, item, projectId);
          });
        } else if (typeof value === 'object') {
          const newPrefix = `${prefix}${key}`;
          processNestedStructure(newPrefix, value, projectId);
        } else { 
          const fieldName = `${prefix}${key}`;
          const logRecord = new Log({
            userId: req.user._id,
            projectId,
            fieldName,
            fieldValue: value,
          });
          logRecord.save();
        }
      }
    }


    return res
      .status(201)
      .json({ message: "form created successfully", savedForm });

  } catch (error) {
    console.error("Error during form submission:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.editFormByProjectId = async (req, res) => {
  try {
    const projectId = req.params.projectId; // Assuming projectId is part of the URL parameters
    const s3FileUrls = req.files;
    let data = req.body;

    // Retrieve the existing form by projectId
    const existingForm = await FieldForm.findOne({ projectId });

    if (!existingForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Update the existing form data
    if (data?.interviewee) {
      data.interviewee = JSON.parse(data.interviewee);
      data.interviewee = data?.interviewee.map((interviewee, index) => ({
        ...interviewee,
        businessCardBack: (s3FileUrls['businessCardBack[]'] && s3FileUrls['businessCardBack[]'][index]?.filename) || null,
        businessCardFront: (s3FileUrls['businessCardFront[]'] && s3FileUrls['businessCardFront[]'][index]?.filename) || null,
        document: (s3FileUrls['document[]'] && s3FileUrls['document[]'][index]?.filename) || null,
      }));
    }

    if (data?.propertyStructure) data.propertyStructure = JSON.parse(data.propertyStructure);
    if (data?.interviewStructure) data.interviewStructure = JSON.parse(data.interviewStructure);
    if (data?.docOverView) data.docOverView = JSON.parse(data.docOverView);
    if (data?.floodData) data.floodData = JSON.parse(data.floodData); 
    if (data?.sowStatement) data.sowStatement = JSON.parse(data.sowStatement);
    if (data?.weatherData) data.weatherData = JSON.parse(data.weatherData);
    data.userId = req.user._id;
    // Update the existing form with the new data
    Object.assign(existingForm, data);

    // Save the updated form
    const updatedForm = await existingForm.save();

    return res.status(200).json({ message: "Form updated successfully", updatedForm });

  } catch (error) {
    console.error("Error during form edit:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};



exports.getForm = async(req, res) =>{
  try {
      const {projectId} = req.params;
      const userId = req.user._id;
      const form = await FieldForm.find({projectId:projectId, userId:userId});
      return res
      .status(200)
      .json({ data:form });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}
