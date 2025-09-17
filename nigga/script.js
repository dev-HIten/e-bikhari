const upload = document.getElementById("upload");
const result = document.getElementById("result");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const facePreview = document.getElementById("facePreview");
const originalPreview = document.getElementById("originalPreview");
const resultCard = document.getElementById("result-card");

let model;

// Load BlazeFace model
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
    // show original image
    originalPreview.src = img.src;

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

      // Extract face region
      const faceData = ctx.getImageData(x, y, w, h);
      let total = 0;
      for (let i = 0; i < faceData.data.length; i += 4) {
        let r = faceData.data[i];
        let g = faceData.data[i + 1];
        let b = faceData.data[i + 2];
        total += (r + g + b) / 3;
      }

      const brightness = total / (faceData.data.length / 4);
      const score = Math.round(((brightness / 255) * 9) + 1);

      result.textContent = `Skin Shade Score: ${score}/10`;

      // Show cropped face
      const faceCanvas = document.createElement("canvas");
      faceCanvas.width = w;
      faceCanvas.height = h;
      faceCanvas.getContext("2d").putImageData(faceData, 0, 0);
      facePreview.src = faceCanvas.toDataURL();

      resultCard.classList.remove("hidden");
    } else {
      result.textContent = "No face detected. Try another image.";
      facePreview.src = "";
      resultCard.classList.remove("hidden");
    }
  };
});