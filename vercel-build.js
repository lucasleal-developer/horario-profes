import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Iniciando build...');

try {
  // Executar o build do Vite
  console.log('Executando build do Vite...');
  execSync('npm run build', { stdio: 'inherit' });

  // Compilar arquivos TypeScript
  console.log('Compilando arquivos TypeScript...');
  execSync('tsc -p tsconfig.json', { stdio: 'inherit' });

  // Criar diretórios necessários
  console.log('Criando diretórios...');
  const dirs = ['dist/server', 'dist/shared', 'dist/public', 'dist/api'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Copiar arquivos da API
  console.log('Copiando arquivos da API...');
  const apiFiles = fs.readdirSync('api');
  apiFiles.forEach(file => {
    if (file.endsWith('.js')) {
      try {
        fs.copyFileSync(`api/${file}`, `dist/api/${file}`);
        console.log(`Arquivo ${file} copiado com sucesso`);
      } catch (err) {
        console.error(`Erro ao copiar arquivo ${file}:`, err);
      }
    }
  });

  // Copiar arquivos do diretório shared
  console.log('Copiando arquivos do diretório shared...');
  const sharedFiles = fs.readdirSync('shared');
  sharedFiles.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.d.ts')) {
      try {
        fs.copyFileSync(`shared/${file}`, `dist/shared/${file}`);
        console.log(`Arquivo ${file} copiado com sucesso`);
      } catch (err) {
        console.error(`Erro ao copiar arquivo ${file}:`, err);
      }
    }
  });

  // Copiar arquivos públicos
  console.log('Copiando arquivos públicos...');
  if (fs.existsSync('public')) {
    const publicFiles = fs.readdirSync('public');
    publicFiles.forEach(file => {
      const sourcePath = path.join('public', file);
      const destPath = path.join('dist/public', file);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        // Se for um diretório, copiar recursivamente
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        
        const subFiles = fs.readdirSync(sourcePath);
        subFiles.forEach(subFile => {
          try {
            fs.copyFileSync(
              path.join(sourcePath, subFile),
              path.join(destPath, subFile)
            );
          } catch (err) {
            console.error(`Erro ao copiar arquivo ${subFile}:`, err);
          }
        });
      } else {
        // Se for um arquivo, copiar diretamente
        try {
          fs.copyFileSync(sourcePath, destPath);
        } catch (err) {
          console.error(`Erro ao copiar arquivo ${file}:`, err);
        }
      }
    });
  } else {
    console.log('Diretório public não encontrado, pulando...');
  }

  // Ajustar caminhos de importação nos arquivos compilados
  console.log('Ajustando caminhos de importação...');
  const serverFiles = fs.readdirSync('dist/server');
  serverFiles.forEach(file => {
    if (file.endsWith('.js')) {
      try {
        const filePath = path.join('dist/server', file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Substituir importações com @shared
        content = content.replace(/from ['"]@shared\/(.*?)['"]/g, 'from "../shared/$1.js"');
        
        fs.writeFileSync(filePath, content);
        console.log(`Caminhos de importação ajustados em ${file}`);
      } catch (err) {
        console.error(`Erro ao ajustar caminhos de importação em ${file}:`, err);
      }
    }
  });

  console.log('Build concluído com sucesso!');
} catch (error) {
  console.error('Erro durante o build:', error);
  process.exit(1);
} 