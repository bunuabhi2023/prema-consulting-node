const FieldForm = require("../models/fieldForm");

exports.FormPost = async (req, res) => {
  try {
    const s3FileUrls = req.files;
    let data = req.body;
    if (data?.interviewee) {
      data.interviewee = JSON.parse(data.interviewee);
      data.interviewee = data?.interviewee.map((interviewee, index) => ({
        ...interviewee,
        businessCardBack: s3FileUrls['businessCardBack[]'][index]?.filename,
        businessCardFront: s3FileUrls['businessCardFront[]'][index]?.filename,
        document: s3FileUrls['document[]'][index]?.filename,
      }));
    }
    if (data?.propertyStructure) data.propertyStructure = JSON.parse(data.propertyStructure);

    if (data?.interviewStructure) data.interviewStructure = JSON.parse(data.interviewStructure);

    if (data?.fieldSketch) data.fieldSketch = JSON.parse(data.fieldSketch);

    if (data?.docOverView) data.docOverView = JSON.parse(data.docOverView);

    if (data?.floodData) data.floodData = JSON.parse(data.floodData);

    data.userId = req.user._id;
    const form = new FieldForm(data);

    const savedForm = await form.save();
    return res
      .status(201)
      .json({ message: "form created successfully", savedForm });

  } catch (error) {
    console.error("Error during customer signup:", error);
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
