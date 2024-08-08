const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const sharp = require('sharp');
  
const app = express();
const PORT = process.env.PORT || 3000;

// Set up Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Load the MobileNet model
let model;
mobilenet.load().then((loadedModel) => {
    model = loadedModel;
});

// Route for uploading image and making predictions
app.post('/predict', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
        // Read and resize the uploaded image
        const resizedImage = await resizeImage(req.file.path, 224, 224);
        
        // Convert resized image to tensor
        const imageTensor = tf.node.decodeImage(resizedImage);

        // Make predictions using the model
        const predictions = await model.classify(imageTensor);

        // Return predictions as JSON
        res.json({ predictions });
    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Function to resize the image using Sharp
async function resizeImage(imagePath, width, height) {
    return sharp(imagePath)
        .resize({ width, height })
        .toBuffer();
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
