const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'backend', 'controllers');
const servicesDir = path.join(__dirname, 'backend', 'services');

// 1. REFACTOR SERVICES
const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.js'));
for (const file of serviceFiles) {
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find module.exports = { a, b, c }
  const exportsMatch = content.match(/module\.exports\s*=\s*\{([^}]+)\}/);
  if (exportsMatch) {
    const exportedNames = exportsMatch[1].split(',').map(s => s.trim()).filter(s => s);
    
    // For each exported name, add async to its declaration
    for (const name of exportedNames) {
      // match: const name = (...) => { or const name = (...) => store...
      const regex1 = new RegExp(`const\\s+${name}\\s*=\\s*\\(([^)]*)\\)\\s*=>`, 'g');
      content = content.replace(regex1, `const ${name} = async ($1) =>`);
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 2. REFACTOR CONTROLLERS
const controllerFiles = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));
for (const file of controllerFiles) {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const exportsMatch = content.match(/module\.exports\s*=\s*\{([^}]+)\}/);
  if (exportsMatch) {
    const exportedNames = exportsMatch[1].split(',').map(s => s.trim()).filter(s => s);
    
    for (const name of exportedNames) {
      // Find the function body. 
      // Assumption: The functions are defined as `const name = (req, res) => { ... }`
      // We will replace `const name = (req, res) => {` with `const name = async (req, res, next) => { try {`
      // and we need to find the matching closing brace. 
      // Instead of complex AST, let's just do a regex replace if possible.
      // Actually, since they are simple, we can find:
      // const getPatients = (req, res) => {
      //   ...
      // };
      
      const regex = new RegExp(`const\\s+${name}\\s*=\\s*\\(req,\\s*res\\)\\s*=>\\s*\\{([\\s\\S]*?)\\n\\};`, 'g');
      content = content.replace(regex, (match, body) => {
        // add await to service calls: serviceName.method(
        // e.g. patientService.getAll() -> await patientService.getAll()
        let asyncBody = body.replace(/([a-zA-Z0-9_]+Service\.[a-zA-Z0-9_]+)\(/g, 'await $1(');
        return `const ${name} = async (req, res, next) => {\n  try {${asyncBody}\n  } catch (err) {\n    next(err);\n  }\n};`;
      });
      
      // Some might have (req, res, next) already, though unlikely
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

console.log("Refactoring complete");
