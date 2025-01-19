const User = require("../../models/User");

// Get user count controller
const getUserCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        return res.status(200).json({
            success: true,
            count: userCount,
            message: "User count retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching user count:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching user count",
        });
    }
};

module.exports = {
    getUserCount,
};
