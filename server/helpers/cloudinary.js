const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        })
        return result;
    } catch(e) {
        console.log(e);
    }
}

async function imageDeleteUtil(publicId) {
    try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
    }catch(e) {
        console.log(e)
    }
}

const upload = multer({storage});

module.exports = {upload, imageUploadUtil, imageDeleteUtil}
