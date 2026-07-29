const fs = require('fs');
let data = fs.readFileSync('prisma/schema.prisma', 'utf8');
data = data.replace(/@db\.Uuid/g, '');
data = data.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
data = data.replace(/url\s*=\s*env\("DATABASE_URL"\)/g, 'url = "file:./dev.db"');
data = data.replace(/Json\?/g, 'String?');
data = data.replace(/Json/g, 'String');
fs.writeFileSync('prisma/schema.prisma', data);
console.log('Done converting schema.');
