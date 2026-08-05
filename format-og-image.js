const sharp = require('sharp');

async function formatImage() {
  try {
    await sharp('logo_s2s.png')
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile('public/logo_s2s_og.png');
    console.log('OpenGraph image formatted successfully');
  } catch (err) {
    console.error('Error formatting image:', err);
  }
}

formatImage();
