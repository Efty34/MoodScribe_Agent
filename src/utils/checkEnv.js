const path = require('path');
const fs = require('fs');

console.log('Current working directory:', process.cwd());
console.log('Looking for .env file in:', path.join(process.cwd(), '.env'));
console.log('.env file exists:', fs.existsSync(path.join(process.cwd(), '.env'))); 