import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the file
const filePath = path.join(__dirname, 'src/routes/RouteConfig.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix double commas
content = content.replace(/},\s*,\s*{/g, '}, {');

// Log the changes
console.log('Fixed double commas in RouteConfig.ts');

// Write the changes back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('RouteConfig.ts has been updated');
