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

// Compilar arquivos TypeScript com esbuild
console.log('Compilando arquivos TypeScript...');
try {
  // Compilar arquivos do servidor
  execSync('esbuild server/*.ts --bundle --platform=node --target=node18 --format=esm --outdir=dist/server --alias:@shared=./shared --external:lightningcss --external:@babel/preset-typescript --external:@babel/preset-typescript/package.json --external:mysql2 --external:mysql2/promise --external:pg --external:events --external:stream --external:util --external:net --external:tls --external:crypto --external:fs --external:path --external:url --external:http --external:https --external:zlib --external:buffer --external:ws --external:ws/lib/stream.js', { stdio: 'inherit' });
  
  // Compilar arquivos compartilhados
  execSync('esbuild shared/*.ts --bundle --platform=node --target=node18 --format=esm --outdir=dist/shared --external:lightningcss --external:@babel/preset-typescript --external:@babel/preset-typescript/package.json --external:mysql2 --external:mysql2/promise --external:pg --external:events --external:stream --external:util --external:net --external:tls --external:crypto --external:fs --external:path --external:url --external:http --external:https --external:zlib --external:buffer --external:ws --external:ws/lib/stream.js', { stdio: 'inherit' });
  
  console.log('Compilação TypeScript concluída com sucesso');
} catch (error) {
  console.error('Erro na compilação TypeScript:', error);
  process.exit(1);
}

// Criar diretórios necessários
console.log('Criando diretórios...');
const dirs = ['dist/server', 'dist/shared', 'dist/public', 'dist/api'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Criando diretório ${dir}...`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copiar arquivos da API
console.log('Copiando arquivos da API...');
const apiDir = path.join(__dirname, 'api');
const apiFiles = fs.readdirSync(apiDir).filter(file => file.endsWith('.js'));

// Garantir que o arquivo index.js seja copiado primeiro
const indexFile = apiFiles.find(file => file === 'index.js');
if (indexFile) {
  const sourcePath = path.join(apiDir, indexFile);
  const destPath = path.join(__dirname, 'dist/api', indexFile);
  console.log(`Copiando ${indexFile}...`);
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Arquivo ${indexFile} copiado com sucesso para ${destPath}`);
  } catch (error) {
    console.error(`Erro ao copiar ${indexFile}:`, error);
  }
}

// Copiar os outros arquivos da API
apiFiles.filter(file => file !== 'index.js').forEach(file => {
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