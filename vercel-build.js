import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Iniciando build...');

// Executar build do Vite
console.log('Executando build do Vite...');
execSync('npm run build', { stdio: 'inherit' });

// Compilar arquivos TypeScript
console.log('Compilando arquivos TypeScript...');
execSync('tsc server/*.ts shared/*.ts --outDir dist --esModuleInterop true', { stdio: 'inherit' });

// Criar diretórios necessários
console.log('Criando diretórios...');
const dirs = ['dist/server', 'dist/shared', 'dist/public', 'dist/api'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Criando diretório ${dir}...`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copiar arquivos do servidor
console.log('Copiando arquivos do servidor...');
const serverFiles = [
  'storage.ts',
  'neonStorage.ts',
  'db.ts',
  'neondb.ts',
  'vite.ts'
];

serverFiles.forEach(file => {
  const sourcePath = path.join(__dirname, 'server', file);
  const destPath = path.join(__dirname, 'dist/server', file.replace('.ts', '.js'));
  console.log(`Copiando ${file}...`);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Arquivo ${file} copiado com sucesso para ${destPath}`);
  } else {
    console.error(`Arquivo ${file} não encontrado em ${sourcePath}`);
  }
});

// Copiar arquivos compartilhados
console.log('Copiando arquivos compartilhados...');
const sharedFiles = ['schema.ts'];
sharedFiles.forEach(file => {
  const sourcePath = path.join(__dirname, 'shared', file);
  const destPath = path.join(__dirname, 'dist/shared', file.replace('.ts', '.js'));
  console.log(`Copiando ${file}...`);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Arquivo ${file} copiado com sucesso para ${destPath}`);
  } else {
    console.error(`Arquivo ${file} não encontrado em ${sourcePath}`);
  }
});

// Copiar arquivos da API
console.log('Copiando arquivos da API...');
const apiDir = path.join(__dirname, 'api');
const apiFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.js'));

apiFiles.forEach(file => {
  const sourcePath = path.join(apiDir, file);
  const destPath = path.join(__dirname, 'dist/api', file);
  console.log(`Copiando ${file}...`);
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Arquivo ${file} copiado com sucesso para ${destPath}`);
  } catch (error) {
    console.error(`Erro ao copiar ${file}:`, error);
  }
});

// Copiar arquivos públicos
console.log('Copiando arquivos públicos...');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  const publicFiles = fs.readdirSync(publicDir);
  publicFiles.forEach(file => {
    const sourcePath = path.join(publicDir, file);
    const destPath = path.join(__dirname, 'dist/public', file);
    console.log(`Copiando ${file}...`);
    if (fs.lstatSync(sourcePath).isDirectory()) {
      fs.cpSync(sourcePath, destPath, { recursive: true });
      console.log(`Diretório ${file} copiado com sucesso`);
    } else {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Arquivo ${file} copiado com sucesso`);
    }
  });
} else {
  console.log('Diretório public não encontrado, pulando...');
}

console.log('Build concluído com sucesso!'); 