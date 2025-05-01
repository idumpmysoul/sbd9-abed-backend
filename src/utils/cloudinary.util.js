// src/utils/cloudinary.util.js
const cloudinary = require('cloudinary').v2;

// Cloudinary will automatically use the CLOUDINARY_URL environment variable
// No need to set cloud_name, api_key, and api_secret separately

module.exports = cloudinary;
