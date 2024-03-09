const express = require('express');
const multer = require('multer');
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');

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
        const imageBuffer = await tf.node.decodeImage(req.file.buffer);
        const predictions = await model.classify(imageBuffer);
        // Return predictions as JSON
        res.json({ predictions });
    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
 