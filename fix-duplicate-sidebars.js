import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to search for files
const pagesDir = path.join(__dirname, 'src', 'pages');

// Regular expressions for finding imports and layout structure
const sidebarImportRegex = /import\s+(?:Sidebar|Header)\s+from\s+['"].*?['"]/g;
const layoutStructureRegex = /<div\s+className="min-h-screen\s+flex\s+bg-background">\s*<Sidebar\s*\/>\s*<div\s+className="flex-1\s+flex\s+flex-col">\s*<Header\s*\/>\s*<main\s+className="flex-1\s+p-6\s+overflow-y-auto(?:.*?)">/s;
const closingTagsRegex = /<\/main>\s*<\/div>\s*<\/div>/s;

// Function to recursively get all .tsx files in a directory
async function getFiles(dir) {
  const subdirs = await fs.promises.readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await fs.promises.stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat().filter(file => file.endsWith('.tsx'));
}

// Function to fix a file
async function fixFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file content
    const content = await fs.promises.readFile(filePath, 'utf8');
    
    // Check if the file has Sidebar or Header imports
    const hasSidebarOrHeaderImports = sidebarImportRegex.test(content);
    
    if (!hasSidebarOrHeaderImports) {
      console.log(`  No Sidebar or Header imports found in ${filePath}`);
      return false;
    }
    
    // Remove Sidebar and Header imports
    let updatedContent = content.replace(sidebarImportRegex, '');
    
    // Check if the file has the layout structure we want to replace
    const hasLayoutStructure = layoutStructureRegex.test(updatedContent);
    
    if (hasLayoutStructure) {
      // Replace the layout structure
      updatedContent = updatedContent.replace(
        layoutStructureRegex,
        '<div className="max-w-6xl mx-auto w-full">'
      );
      
      // Remove closing tags
      updatedContent = updatedContent.replace(closingTagsRegex, '</div>');
      
      // If there are still closing tags that weren't matched by the regex, try to fix them
      if (updatedContent.includes('</main>') || updatedContent.includes('</div></div>')) {
        // Count opening and closing div tags to ensure they match
        const openingDivs = (updatedContent.match(/<div/g) || []).length;
        const closingDivs = (updatedContent.match(/<\/div>/g) || []).length;
        
        if (openingDivs > closingDivs) {
          // Add missing closing divs
          const missingDivs = openingDivs - closingDivs;
          updatedContent += '\n' + '</div>'.repeat(missingDivs);
        } else if (closingDivs > openingDivs) {
          // Remove extra closing divs
          const extraDivs = closingDivs - openingDivs;
          for (let i = 0; i < extraDivs; i++) {
            updatedContent = updatedContent.replace(/<\/div>/, '');
          }
        }
      }
    } else {
      console.log(`  Layout structure not found in ${filePath}`);
      
      // If the file has a return statement with JSX, try to wrap it with a fragment
      if (updatedContent.includes('return (') && !updatedContent.includes('return (<>')) {
        updatedContent = updatedContent.replace(/return\s*\(/g, 'return (<>');
        
        // Find the last closing parenthesis of the return statement
        const lastReturnIndex = updatedContent.lastIndexOf('return (<>');
        if (lastReturnIndex !== -1) {
          // Count opening and closing parentheses to find the matching closing parenthesis
          let openParens = 1;
          let closeIndex = lastReturnIndex + 'return (<>'.length;
          
          while (openParens > 0 && closeIndex < updatedContent.length) {
            if (updatedContent[closeIndex] === '(') openParens++;
            if (updatedContent[closeIndex] === ')') openParens--;
            closeIndex++;
          }
          
          if (closeIndex < updatedContent.length) {
            // Insert the closing fragment tag before the closing parenthesis
            updatedContent = 
              updatedContent.substring(0, closeIndex - 1) + 
              '</>' + 
              updatedContent.substring(closeIndex - 1);
          }
        }
      }
    }
    
    // Write the updated content back to the file
    await fs.promises.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  Fixed ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Get all .tsx files in the pages directory
    const files = await getFiles(pagesDir);
    
    console.log(`Found ${files.length} .tsx files in ${pagesDir}`);
    
    // Fix each file
    let fixedCount = 0;
    for (const file of files) {
      const fixed = await fixFile(file);
      if (fixed) fixedCount++;
    }
    
    console.log(`\nFixed ${fixedCount} files with duplicate sidebar issues.`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();