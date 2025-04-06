import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Executar o build do Vite
console.log('Executando build do Vite...');
execSync('npm run build', { stdio: 'inherit' });

// Copiar os arquivos do servidor para a pasta dist
console.log('Copiando arquivos do servidor...');
const serverDir = path.join(__dirname, 'server');
const distServerDir = path.join(__dirname, 'dist', 'server');

// Criar diretório se não existir
if (!fs.existsSync(distServerDir)) {
  fs.mkdirSync(distServerDir, { recursive: true });
}

// Copiar arquivos do servidor
const serverFiles = fs.readdirSync(serverDir);
for (const file of serverFiles) {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const sourcePath = path.join(serverDir, file);
    const destPath = path.join(distServerDir, file.replace('.ts', '.js'));
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copiado: ${file}`);
  }
}

// Copiar arquivos da pasta shared
console.log('Copiando arquivos compartilhados...');
const sharedDir = path.join(__dirname, 'shared');
const distSharedDir = path.join(__dirname, 'dist', 'shared');

// Criar diretório se não existir
if (!fs.existsSync(distSharedDir)) {
  fs.mkdirSync(distSharedDir, { recursive: true });
}

// Copiar arquivos compartilhados
const sharedFiles = fs.readdirSync(sharedDir);
for (const file of sharedFiles) {
  if (file.endsWith('.ts') || file.endsWith('.js')) {
    const sourcePath = path.join(sharedDir, file);
    const destPath = path.join(distSharedDir, file.replace('.ts', '.js'));
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copiado: ${file}`);
  }
}

console.log('Build concluído com sucesso!'); 