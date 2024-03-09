document.getElementById('predictButton').addEventListener('click', async function() {
    const fileInput = document.getElementById('uploadInput');
    const file = fileInput.files[0];
    if (file) {
      try {
        const image = await loadImage(file);
        const predictions = await predictCarModel(image);
        displayPredictions(predictions);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });
  
  async function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }    
  
  async function predictCarModel(image) {
    const model = await mobilenet.load();
    const predictions = await model.classify(image);
    return predictions;
  }
  
  function displayPredictions(predictions) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    predictions.forEach(prediction => {
      const p = document.createElement('p');
      p.textContent = `${prediction.className}: ${Math.round(prediction.probability * 100)}%`;
      resultDiv.appendChild(p);
    });
  }

  //Loading animation in button
  async function predict() {
    // Disable the button and change text to "Predicting..."
    const button = document.getElementById("predictButton");
    button.disabled = true;
    document.getElementById("buttonText").textContent = "Predicting";

    // Show loading spinner
    document.getElementById("loadingSpinner").classList.remove("d-none");

    // Get the file input and perform TensorFlow predictions
    const fileInput = document.getElementById('uploadInput');
    const file = fileInput.files[0];
    if (file) {
        try {
            const image = await loadImage(file);
            const predictions = await predictCarModel(image);
            displayPredictions(predictions);
        } catch (error) {
            console.error('Error:', error);
        }     
    }

    // Remove the timeout and directly enable the button and hide the loading spinner after predictions are done
    // Change this part with the actual time it takes for your TensorFlow predictions
    button.disabled = false;
    document.getElementById("buttonText").textContent = "Predict";
    document.getElementById("loadingSpinner").classList.add("d-none");
}
  
//Dynamic image upload 
// Add event listener to file input element
document.getElementById('uploadInput').addEventListener('change', function(event) {
  const file = event.target.files[0]; // Get the selected file
  const defaultImage = document.getElementById('defaultImage');

  // Check if a file was selected and it's an image
  if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      // Read the file content as a data URL
      reader.onload = function(e) {
          defaultImage.src = e.target.result; // Set the data URL as source for defaultImage
      };

      reader.readAsDataURL(file);
  }
}); 
