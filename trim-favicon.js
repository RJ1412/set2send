const sharp = require('sharp');

async function aggressiveTrim() {
  try {
    const original = sharp('logo_s2s.png');
    
    // Aggressive trim using a threshold to remove all the dark background
    await original
      .trim({ threshold: 60 }) // High threshold to remove dark gradient background
      .toFile('src/app/icon.png');
      
    // Let's get the new dimensions
    const meta = await sharp('src/app/icon.png').metadata();
    console.log(`Successfully trimmed to: ${meta.width}x${meta.height}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

aggressiveTrim();
