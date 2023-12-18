const Comment = require('../models/comment');

exports.createComment = async(req, res) =>{
    try {
        const userId = req.user._id;
        const {projectId, fieldName, fieldValue} = req.body;
        const newComment = new Comment({
            userId,
            projectId,
            fieldName,
            fieldValue
        });
        const savedComment =  await newComment.save();
        const populatedComment = await Comment.populate(savedComment, { path: 'userId', select: 'name' });

        // Modify the response to include the populated user information
        const responseData = {
            data: populatedComment
        };

        return res.status(201).json(responseData)
    } catch (error) {      
        return res.status(500).json({ message: "Something went wrong" });
    }
};

exports.getComment =  async(req, res) =>{
    try {
        const {projectId, fieldName} =  req.params;

        const comments = await Comment.find({projectId:projectId, fieldName:fieldName}).populate('userId', 'name');

        return res.status(200).json({data:comments});
    } catch (error) {      
        return res.status(500).json({ message: "Something went wrong" });
    }
}