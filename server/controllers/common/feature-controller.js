const Feature = require('../../models/Feature')

const addFeatureImage = async(req,res)=>{
    try {
        const {url, publicId} = req.body;
        const featureImages = new Feature({
            url: url,
            publicId: publicId
        })

        await featureImages.save();
        res.status(201).json({
            success: true,
            data: featureImages,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error adding image",
        });
    }
}

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