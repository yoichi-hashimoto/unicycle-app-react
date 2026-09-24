const sharp = require("sharp");

sharp("./public/images/mountain.png")
  .resize({
    width: 600,
    withoutEnlargement: true,
  })
  .webp({
    quality: 60,
  })
  .toFile("./public/images/mountain_light.png")
  .then(() => {
    console.log("軽量版を作成しました");
  });
