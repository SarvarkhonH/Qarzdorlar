const express = require('express');
require('dotenv').config();
const sharp = require('sharp');
const firebase = require('firebase/app');
const multer = require('multer');
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require('firebase/storage');

const authController = require('../controllers/authcontroller');

const router = express.Router();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
firebase.initializeApp(firebaseConfig);
const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/upload',
  authController.protect,
  upload.single('image'),
  async (req, res) => {
    try {
      console.log('req file in /upload route: ', req.file);
      const { file } = req;
      const resizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800 })
        .toBuffer();
      const storageRef = ref(
        storage,
        `images/${Date.now()}${file.originalname}`,
      );
      await uploadBytes(storageRef, resizedImageBuffer);
      const imageUrl = await getDownloadURL(storageRef);
      res.status(201).json({
        status: 'success',
        data: {
          imageUrl,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error.message,
      });
    }
  },
);

router.post('/deleteImage', authController.protect, async (req, res) => {
  try {
    const imageRef = ref(getStorage(), req.body.image);
    console.log(req.body);

    const result = await deleteObject(imageRef);

    console.log({ result });

    res.status(201).json({
      status: 'success',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});
module.exports = router;
