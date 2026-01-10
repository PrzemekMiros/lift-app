const fs = require('fs');
const path = require('path');

const basePathArg = process.argv[2] || '/app';
const distDirArg = process.argv[3] || 'dist';
const distDir = path.isAbsolute(distDirArg)
  ? distDirArg
  : path.join(__dirname, '..', distDirArg);
const basePath = basePathArg.endsWith('/') ? basePathArg.slice(0, -1) : basePathArg;

const fileExtensions = new Set(['.html', '.js', '.json', '.css']);

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, fileList);
      continue;
    }
    if (fileExtensions.has(path.extname(entry.name))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function replacePaths(content) {
  let next = content;
  next = next.replace(/(["'])\/assets\//g, `$1${basePath}/assets/`);
  next = next.replace(/(["'])\/_expo\//g, `$1${basePath}/_expo/`);
  return next;
}

if (!fs.existsSync(distDir)) {
  console.error(`Missing dist folder at ${distDir}. Run expo export first.`);
  process.exit(1);
}

const files = walk(distDir);
for (const filePath of files) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = replacePaths(original);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

console.log(`Postprocess complete. Base path set to ${basePath}`);
