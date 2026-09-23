const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "public/images/skills");

const files = fs.readdirSync(inputDir);

async function convertImages() {
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".png")) continue;

    const inputPath = path.join(inputDir, file);

    const outputFile = file.replace(/\.png$/i, ".webp");
    const outputPath = path.join(inputDir, outputFile);

    try {
      await sharp(inputPath)
        .resize({
          width: 300,
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
        })
        .toFile(outputPath);

      console.log(`変換完了: ${file} → ${outputFile}`);
    } catch (error) {
      console.error(`エラー: ${file}`, error);
    }
  }
}

convertImages();
