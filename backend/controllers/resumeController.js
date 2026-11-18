import User from "../models/User.js";

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    const user = await User.findById(req.user.id);

    user.resume = req.file.path;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume Uploaded Successfully",
      resume: req.file.path,
    });
  } catch (error) {
    console.error("Resume Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { uploadResume };