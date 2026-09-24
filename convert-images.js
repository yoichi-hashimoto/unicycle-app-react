const sharp = require("sharp");

sharp("./public/images/animals/animals_line2.webp")
  .resize({
    width: 600,
    withoutEnlargement: true,
  })
  .webp({
    quality: 60,
  })
  .toFile("./public/images/animals/animals_line2_light.webp")
  .then(() => {
    console.log("軽量版を作成しました");
  });
