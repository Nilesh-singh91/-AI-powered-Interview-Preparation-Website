const getUserProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {

    console.error("Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, profileImage } = req.body;

    // Logged-in user middleware se milta hai
    const user = req.user;

    // Update fields
    if (name) {
      user.name = name;
    }

    if (profileImage) {
      user.profileImage = profileImage;
    }

    // Save changes
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { getUserProfile, updateUserProfile };

