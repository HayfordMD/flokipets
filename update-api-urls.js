const fs = require('fs');
const path = require('path');

const EXPO_ENV_VAR = "`${process.env.EXPO_PUBLIC_API_URL || ''}";

const filesToUpdate = [
  "src/app/index.tsx",
  "src/app/store.tsx",
  "src/app/mint.tsx",
  "src/hooks/useAuth.ts",
  "src/components/TopNavBar.tsx",
  "src/components/app-tabs.web.tsx",
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, 'src', '..', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace fetch("/api/...) with fetch(`${process.env.EXPO_PUBLIC_API_URL || ''}/api/...)
    // Handling double quotes
    content = content.replace(/fetch\("\/api\/(.*?)"/g, 'fetch(`${process.env.EXPO_PUBLIC_API_URL || \'\'}/api/$1`');
    // Handling single quotes
    content = content.replace(/fetch\('\/api\/(.*?)'/g, 'fetch(`${process.env.EXPO_PUBLIC_API_URL || \'\'}/api/$1`');
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  }
});

// Update ncb-utils.ts separately since it uses CONFIG.appUrl
const utilsPath = path.join(__dirname, 'src', 'lib', 'ncb-utils.ts');
if (fs.existsSync(utilsPath)) {
  let content = fs.readFileSync(utilsPath, 'utf8');
  content = content.replace(/\$\{CONFIG.appUrl\}\/api\//g, '${process.env.EXPO_PUBLIC_API_URL || \'\'}/api/');
  fs.writeFileSync(utilsPath, content);
  console.log(`Updated ncb-utils.ts`);
}

// Update tests
const testPath = path.join(__dirname, 'src', 'app', 'api', 'auth', '__tests__', 'auth.test.ts');
if (fs.existsSync(testPath)) {
  let content = fs.readFileSync(testPath, 'utf8');
  content = content.replace(/http:\/\/localhost\/api\//g, '${process.env.EXPO_PUBLIC_API_URL || \'http://localhost\'}/api/');
  content = content.replace(/'http:\/\/localhost/g, '`http://localhost');
  content = content.replace(/\/api\/auth\/sign-in\/email'/g, '/api/auth/sign-in/email`');
  fs.writeFileSync(testPath, content);
  console.log(`Updated auth.test.ts`);
}
