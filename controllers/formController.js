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
    async function processNestedStructure(prefix, obj, projectId, req, res) {
      const fieldName = prefix;
      if (Array.isArray(obj)) {
        // If obj is an array, iterate through its elements
        for (let i = 0; i < obj.length; i++) {
          const arrayItem = obj[i];
          await processNestedStructure(`${fieldName}.${i}`, arrayItem, projectId, req, res);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        // If obj is an object, recursively process it
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            await processNestedStructure(`${fieldName}.${key}`, obj[key], projectId, req, res);
          }
        }
      } else {
        // If obj is a primitive type, log the field
        const logRecord = new Log({
          userId: req.user._id,
          projectId,
          fieldName:fieldName.slice(1),
          fieldValue : obj,
        });
        await logRecord.save();
      }
    }
    
    
    
     await processNestedStructure(``, data, projectId, req, res);


    return res.status(201).json({ message: "form created successfully", savedForm });

  } catch (error) {
    console.error("Error during form submission:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


const updateField = (obj, keys, value) => {
  let currentObj = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (Array.isArray(currentObj[key])) {
      const index = parseInt(keys[i + 1], 10);
      currentObj[key][index] = currentObj[key][index] || {};
      currentObj = currentObj[key][index];
      i++; // Skip the next index since we handled it
    } else {
      currentObj[key] = currentObj[key] || {};
      currentObj = currentObj[key];
    }
  }
  currentObj[keys[keys.length - 1]] = value;
};

exports.editFormByProjectId = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const s3FileUrls = req.files;
    const { fieldName, value } = req.body;

    // Retrieve the existing form by projectId
    const existingForm = await FieldForm.findOne({ projectId });

    if (!existingForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Parse fieldName to get keys
    const keys = fieldName.split('.');

    // Update the existing form data
    updateField(existingForm, keys, value);

    // Update userId
    existingForm.userId = req.user._id;

    // Save the updated form
    const updatedForm = await existingForm.save();

    const logRecord = new Log({
      userId: req.user._id,
      projectId: projectId,
      fieldName: fieldName,
      fieldValue: value,
    });
    await logRecord.save();

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


exports.getlogs = async(req, res) =>{
  try {
      const {projectId, fieldName} = req.params;
     
      const logs = await Log.find({projectId:projectId, fieldName:fieldName}).populate('userId', 'name');
      return res
      .status(200)
      .json({ data:logs });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}