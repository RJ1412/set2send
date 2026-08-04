const Jimp = require('jimp');

async function trimImage() {
  try {
    const image = await Jimp.read('logo_s2s.png');
    // autocrop trims borders automatically. We will use it with a tolerance and crop only transparent pixels
    image.autocrop(); 
    await image.writeAsync('src/app/icon.png');
    console.log('Image cropped successfully');
  } catch (err) {
    console.error('Error trimming image:', err);
  }
}

trimImage();
