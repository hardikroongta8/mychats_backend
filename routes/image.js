const multer = require('multer');
const cloudinary = require('cloudinary');
const streamifier = require('streamifier');
const {authenticateToken} = require('../middlewares/authenticate');

const router = require('express').Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

router.post('/upload', upload.single('pic'), async(req, res) => {
    try {
        if(req.file){
            let cloud_upload_stream = cloudinary.uploader.upload_stream(
                async function(result, error){
                    if(error) return res.status(400).json({message: error});
                    return res.json({imageUrl: result.secure_url});
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(cloud_upload_stream);
        }else{
            return res.status(400).json({message: 'No file present'});
        } 
    }catch(err){
        return res.status(400).json({message: err.message});
    }
});

module.exports = router;