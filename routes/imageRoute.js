const express = require('express');
const router = express.Router();
const firebase = require('firebase/app');
const multer = require('multer');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const Image = require('../models/imageModel'); // Use the correct model name

// Initialize Firebase (for Firebase Storage)
const firebaseConfig = {
  apiKey: 'AIzaSyDehSSKdi-1CUSHUAL1uwwHu_rSmW3LUTI',
  authDomain: 'qarzdorlar-dbf07.firebaseapp.com',
  projectId: 'qarzdorlar-dbf07',
  storageBucket: 'qarzdorlar-dbf07.appspot.com', // Remove 'gs://' from the bucket URL
  messagingSenderId: '107834105923',
  appId: '1:107834105923:web:382726c1176e2c0a2db4f6',
};
firebase.initializeApp(firebaseConfig);
const storage = getStorage();

// Configure Multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

router.post ('/upload', upload.single('file'), async (req, res) => {
  try {
    // Get the uploaded file
    const { file } = req;
    console.log(file)
    // Upload the file to Firebase Storage
    const storageRef = ref(storage, `images/${Date.now()}${file.originalname}`);
    await uploadBytes(storageRef, file.buffer);

    const imageUrl = await getDownloadURL(storageRef);
    console.log(imageUrl)
  //  await Image.create({"url":"imageUrl"})

    
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
});

module.exports = router;


