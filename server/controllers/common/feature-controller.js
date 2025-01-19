const Feature = require('../../models/Feature')

const addFeatureImage = async (req, res) => {
    try {
        const images = req.body; // Expecting an array of objects

        if (!Array.isArray(images) || images.length === 0) {
            return res
                .status(400)
                .json({ message: "Invalid data. Provide an array of images." });
        }

        // Validate the input structure
        const validImages = images.filter(
            (image) => image.secure_url && image.public_id
        );
        if (validImages.length !== images.length) {
            return res
                .status(400)
                .json({
                    message:
                        "Some records are missing secure_url or public_id.",
                });
        }

        // Map the incoming data to the schema
        const formattedImages = validImages.map((image) => ({
            secureUrl: image.secure_url,
            publicId: image.public_id,
        }));

        // Save all images in bulk
        const savedImages = await Feature.insertMany(formattedImages);

        return res.status(201).json({
            message: "Images successfully created",
            data: savedImages,
        });
    } catch (error) {
        console.error("Error creating images:", error);
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
};

const getFeatureImages = async (req, res) => {
    try {
        const images = await Feature.find({});
        
        res.status(201).json({
            success: true,
            data: images,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error getting images",
        });
    }
};

const deleteFeatureImage = async (req, res)=>{
    try {
        const { id } = req.params;
        const image = await Feature.findByIdAndDelete(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "image not found",
            });
        }
        res.status(201).json({
            success: true,
            message: 'successfully deleted images'
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error getting images",
        });
    }
}

module.exports = {addFeatureImage, getFeatureImages, deleteFeatureImage}