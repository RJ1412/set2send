const sharp = require('sharp');

async function makeSquareIcon() {
  try {
    // Trim the large empty space
    const trimmedBuffer = await sharp('logo_s2s.png')
      .trim({ threshold: 40 })
      .toBuffer();
      
    // Now take the trimmed image and force it into a square container 
    // so it uses the maximum space available.
    await sharp(trimmedBuffer)
      .resize(300, 300, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile('src/app/icon.png');
      
    console.log('Square favicon created successfully');
  } catch (err) {
    console.error('Error:', err);
  }
}

makeSquareIcon();
