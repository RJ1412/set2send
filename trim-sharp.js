const sharp = require('sharp');

async function trimImage() {
  try {
    await sharp('logo_s2s.png')
      .trim()
      .toFile('src/app/icon.png');
    console.log('Image cropped successfully');
  } catch (err) {
    console.error('Error trimming image:', err);
  }
}

trimImage();
