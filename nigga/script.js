const upload = document.getElementById("upload");
const resultText = document.getElementById("result-text");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const facePreview = document.getElementById("facePreview");
const originalPreview = document.getElementById("originalPreview");
const resultBox = document.getElementById("result-box");

let model;

// Load the BlazeFace model
async function loadModel() {
    model = await blazeface.load();
    console.log("BlazeFace model loaded!");
}
loadModel();

upload.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        // Display the original image
        originalPreview.src = img.src;
        originalPreview.classList.remove("hidden");
        
        // Hide other elements for a fresh start
        facePreview.classList.add("hidden");
        resultBox.classList.add("hidden");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const predictions = await model.estimateFaces(img, false);

        if (predictions.length > 0) {
            const face = predictions[0];
            const [x, y, w, h] = [
                face.topLeft[0],
                face.topLeft[1],
                face.bottomRight[0] - face.topLeft[0],
                face.bottomRight[1] - face.topLeft[1],
            ];

            // Extract the face region's pixel data
            const faceData = ctx.getImageData(x, y, w, h);
            let totalBrightness = 0;
            for (let i = 0; i < faceData.data.length; i += 4) {
                const r = faceData.data[i];
                const g = faceData.data[i + 1];
                const b = faceData.data[i + 2];
                // Use a standard luminance formula for brightness
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                totalBrightness += brightness;
            }

            const averageBrightness = totalBrightness / (faceData.data.length / 4);
            const roundedBrightness = Math.round(averageBrightness);

            // Conditional message based on brightness
            if (roundedBrightness < 115) {
                resultText.textContent = `Average Face Brightness: ${roundedBrightness}/255. Note: nigga spotted.`;
            } else if (roundedBrightness >= 140 && roundedBrightness <= 160) {
                resultText.textContent = `Average Face Brightness: ${roundedBrightness}/255. Note: aap toh sundar ho`;
            } else if (roundedBrightness > 160) {
                resultText.textContent = `Average Face Brightness: ${roundedBrightness}/255. Note: albino.`;
            } else {
                resultText.textContent = `Average Face Brightness: ${roundedBrightness}/255.`;
            }

            // Show the cropped face
            const faceCanvas = document.createElement("canvas");
            faceCanvas.width = w;
            faceCanvas.height = h;
            faceCanvas.getContext("2d").putImageData(faceData, 0, 0);
            facePreview.src = faceCanvas.toDataURL();
            facePreview.classList.remove("hidden");

            resultBox.classList.remove("hidden");

        } else {
            resultText.textContent = "No face detected. Please try another image.";
            facePreview.classList.add("hidden");
            resultBox.classList.remove("hidden");
        }
    };
});