const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const uploadToCloudinary = async (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "orgchat",
                resource_type: "auto",
                ...options,
            },
            (error, result) => {
                if(error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

const deleteFromCloudinary = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

module.exports =  { cloudinary, uploadToCloudinary, deleteFromCloudinary };