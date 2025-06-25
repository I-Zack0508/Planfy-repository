const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const { updateProfile, updateProfilePic, getProfile, updatePassword, deleteUser } = require('../controllers/userController');

// Configuração do multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `user_${req.userId}_${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

router.put('/profile-pic', auth, upload.single('profilePic'), updateProfilePic);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, updatePassword);
router.delete('/delete', auth, deleteUser);

module.exports = router;