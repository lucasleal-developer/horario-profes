const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Executa o build do Vite
console.log('Building Vite frontend...');
execSync('npm run build', { stdio: 'inherit' });

// Cria os diretórios necessários
const serverDir = path.join(__dirname, 'dist', 'server');
const sharedDir = path.join(__dirname, 'dist', 'shared');

if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
}
if (!fs.existsSync(sharedDir)) {
  fs.mkdirSync(sharedDir, { recursive: true });
}

// Copia os arquivos do servidor
console.log('Copying server files...');
const serverFiles = [
  'storage.js',
  'neonStorage.js',
  'db.js',
  'neondb.js',
  'vite.js'
];

serverFiles.forEach(file => {
  const sourcePath = path.join(__dirname, 'server', file);
  const destPath = path.join(serverDir, file);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to dist/server/`);
  }
});

// Copia os arquivos compartilhados
console.log('Copying shared files...');
const sharedFiles = [
  'schema.js'
];

sharedFiles.forEach(file => {
  const sourcePath = path.join(__dirname, 'shared', file);
  const destPath = path.join(sharedDir, file);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to dist/shared/`);
  }
});

console.log('Build completed successfully!'); 