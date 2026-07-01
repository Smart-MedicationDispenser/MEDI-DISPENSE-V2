const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'backend', 'controllers');

const controllerFiles = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));
for (const file of controllerFiles) {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Instead of a complex regex for the whole body, let's just replace the signature and add try/catch
  // Since all functions are of the form:
  // const myFunc = (req, res) => {
  //   ...
  // };
  // we can just replace:
  // `const myFunc = (req, res) => {`
  // with
  // `const myFunc = async (req, res, next) => {\n  try {`
  // and we have to replace the closing `};` with `} catch(err) { next(err); }\n};`
  // But closing `};` could be anywhere.
  // Better yet, I can just use AST or simpler regex.
  
  // Let's do a simple regex:
  // Find all functions: const myFunc = (req, res) => {
  // We can use a regex that captures the body up to the matching '};' at the beginning of a line.
  const regex = /const\s+([a-zA-Z0-9_]+)\s*=\s*\(\s*req\s*,\s*res\s*\)\s*=>\s*\{([\s\S]*?)^};/gm;
  
  content = content.replace(regex, (match, name, body) => {
    // replace service calls
    let asyncBody = body.replace(/([a-zA-Z0-9_]+Service\.[a-zA-Z0-9_]+)\(/g, 'await $1(');
    
    // add await for other services like auditService
    // wait, we already did it with the generic replacement above.
    
    return `const ${name} = async (req, res, next) => {\n  try {${asyncBody}  } catch (err) {\n    next(err);\n  }\n};`;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log("Controller refactoring done");
