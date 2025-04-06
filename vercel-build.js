import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Iniciando build...');

try {
  // Remover node_modules e package-lock.json
  console.log('Removendo node_modules e package-lock.json...');
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }

  // Reinstalar dependências
  console.log('Reinstalando dependências...');
  execSync('npm install', { stdio: 'inherit' });

  // Criar diretórios necessários
  console.log('Criando diretórios...');
  const dirs = ['dist/server', 'dist/shared', 'dist/public', 'dist/api'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Copiar arquivos TypeScript do servidor
  console.log('Copiando arquivos TypeScript do servidor...');
  const serverTsFiles = fs.readdirSync('server');
  serverTsFiles.forEach(file => {
    if (file.endsWith('.ts')) {
      try {
        fs.copyFileSync(`server/${file}`, `dist/server/${file}`);
        console.log(`Arquivo ${file} copiado com sucesso`);
      } catch (err) {
        console.error(`Erro ao copiar arquivo ${file}:`, err);
      }
    }
  });

  // Copiar vite.config.ts
  console.log('Copiando vite.config.ts...');
  try {
    fs.copyFileSync('vite.config.ts', 'dist/vite.config.ts');
    console.log('vite.config.ts copiado com sucesso');
  } catch (err) {
    console.error('Erro ao copiar vite.config.ts:', err);
  }

  // Compilar arquivos TypeScript
  console.log('Compilando arquivos TypeScript...');
  execSync('tsc -p tsconfig.json', { stdio: 'inherit' });

  // Executar build do Vite
  console.log('Executando build do Vite...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.warn('Aviso: Build do Vite falhou, continuando com o build do servidor...', error);
  }

  // Copiar e processar arquivos da API
  console.log('Copiando e processando arquivos da API...');
  const apiFiles = fs.readdirSync('api');
  apiFiles.forEach(file => {
    if (file.endsWith('.js')) {
      try {
        // Ler o conteúdo do arquivo
        let content = fs.readFileSync(`api/${file}`, 'utf8');
        
        // Ajustar importações
        content = content.replace(/from ['"]\.\.\/server\/(.*?)['"]/g, 'from "../server/$1.js"');
        content = content.replace(/from ['"]\.\.\/shared\/(.*?)['"]/g, 'from "../shared/$1.js"');
        
        // Escrever o arquivo processado
        fs.writeFileSync(`dist/api/${file}`, content);
        console.log(`Arquivo ${file} processado e copiado com sucesso`);
      } catch (err) {
        console.error(`Erro ao processar arquivo ${file}:`, err);
      }
    }
  });

  // Copiar arquivos do diretório shared
  console.log('Copiando arquivos do diretório shared...');
  const sharedFiles = fs.readdirSync('shared');
  sharedFiles.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.ts')) {
      try {
        fs.copyFileSync(`shared/${file}`, `dist/shared/${file}`);
        console.log(`Arquivo ${file} copiado com sucesso`);
      } catch (err) {
        console.error(`Erro ao copiar arquivo ${file}:`, err);
      }
    }
  });

  // Verificar se os arquivos foram compilados
  console.log('Verificando arquivos compilados...');
  const serverFiles = fs.readdirSync('dist/server');
  console.log('Arquivos no diretório dist/server:', serverFiles);

  // Verificar se os arquivos necessários foram compilados
  const requiredFiles = ['neonStorage.js', 'storage.js', 'vite.js'];
  for (const file of requiredFiles) {
    if (!fs.existsSync(`dist/server/${file}`)) {
      console.error(`Arquivo ${file} não foi compilado corretamente.`);
      process.exit(1);
    }
  }

  // Ajustar caminhos de importação nos arquivos compilados
  console.log('Ajustando caminhos de importação...');
  serverFiles.forEach(file => {
    if (file.endsWith('.js')) {
      try {
        const filePath = path.join('dist/server', file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Substituir importações
        content = content.replace(/from ['"]@shared\/(.*?)['"]/g, 'from "../shared/$1.js"');
        content = content.replace(/from ['"]\.\/([^'"]+)['"]/g, 'from "./$1.js"');
        content = content.replace(/from ['"]\.\.\/vite\.config['"]/g, 'from "../vite.config.js"');
        
        fs.writeFileSync(filePath, content);
        console.log(`Caminhos de importação ajustados em ${file}`);
      } catch (err) {
        console.error(`Erro ao ajustar caminhos de importação em ${file}:`, err);
      }
    }
  });

  // Copiar arquivos do build do Vite para o diretório public
  console.log('Copiando arquivos do build do Vite...');
  if (fs.existsSync('dist/client')) {
    const copyRecursive = (src, dest) => {
      if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach(file => {
          const srcPath = path.join(src, file);
          const destPath = path.join(dest, file);
          copyRecursive(srcPath, destPath);
        });
      } else {
        try {
          fs.copyFileSync(src, dest);
          console.log(`Arquivo ${path.relative('dist/client', src)} copiado com sucesso para public`);
        } catch (err) {
          console.error(`Erro ao copiar arquivo ${src}:`, err);
        }
      }
    };

    copyRecursive('dist/client', 'dist/public');
  }

  console.log('Build concluído com sucesso!');
} catch (error) {
  console.error('Erro durante o build:', error);
  process.exit(1);
} 