// Script to remove the models folder from the dist directory
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, 'dist', 'models');

// Check if the models directory exists
if (fs.existsSync(modelsDir)) {
  console.log('Removing models directory from dist...');

  // Function to recursively remove a directory
  function removeDir(dir) {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach((file) => {
        const curPath = path.join(dir, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // Recursive call for directories
          removeDir(curPath);
        } else {
          // Delete file
          fs.unlinkSync(curPath);
        }
      });
      // Delete the now-empty directory
      fs.rmdirSync(dir);
    }
  }

  // Remove the models directory
  removeDir(modelsDir);
  console.log('Models directory removed successfully.');
} else {
  console.log('Models directory not found in dist.');
}
