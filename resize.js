import sharp from "sharp";
import path from "path";

const fileConfigs = [
  {
    fileName: "android-chrome-192x192.png",
    size: 192,
  },
  {
    fileName: "android-chrome-512x512.png",
    size: 512,
  },
  {
    fileName: "apple-touch-icon.png",
    size: 180,
  },
  {
    fileName: "favicon-16x16.png",
    size: 16,
  },
  {
    fileName: "favicon-32x32.png",
    size: 32,
  },
  {
    fileName: "favicon.ico",
    size: 48,
  },
  {
    fileName: "twitter.png",
    size: 800,
  }
];

const inputImagePath = "./public/images/base.png";
const outputDir = "./public/images";

async function resizeImage(fileName, size) {
  const outputPath = path.join(outputDir, fileName);
  try {
    await sharp(inputImagePath)
      .resize(size, size, {
        fit: "cover",
        position: "center",
      })
      .toFile(outputPath);

    console.log(`Image resized successfully to ${size}x${size}`);
  } catch (error) {
    console.error("Error resizing image:", error);
  }
}

fileConfigs.forEach(({ fileName, size }) => {
  resizeImage(fileName, size);
});

