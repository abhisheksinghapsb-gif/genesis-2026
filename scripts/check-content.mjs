import fs from 'node:fs';
import path from 'node:path';

const contentDir = path.resolve(process.cwd(), 'src/content');
const docsDir = path.resolve(process.cwd(), 'docs');
const checklistPath = path.join(docsDir, 'CONTENT_CHECKLIST.md');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

console.log('🔍 Checking content files in src/content/...\n');

const todos = [];
const errors = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = path.relative(process.cwd(), filePath);

  lines.forEach((line, index) => {
    if (line.includes('TODO')) {
      const match = line.match(/TODO:?\s*([^\n"']+)/);
      const message = match ? match[1].trim() : line.trim();
      todos.push({
        file: relPath,
        line: index + 1,
        message,
      });
    }
  });
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.json')) {
      scanFile(fullPath);
    }
  }
}

walkDir(contentDir);

// Verify sponsor logos exist
try {
  const sponsorsFile = fs.readFileSync(path.join(contentDir, 'sponsors.ts'), 'utf-8');
  const logoMatches = [...sponsorsFile.matchAll(/logo:\s*['"]([^'"]+)['"]/g)];
  for (const match of logoMatches) {
    const logoUrl = match[1];
    const localPath = path.join(process.cwd(), 'public', logoUrl.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) {
      errors.push(`Missing sponsor logo: ${logoUrl} (expected at ${localPath})`);
    }
  }
} catch (e) {
  errors.push(`Failed to verify sponsors: ${e.message}`);
}

// Generate docs/CONTENT_CHECKLIST.md
let checklistMd = '# GENESIS 2026 — Content Launch Checklist\n\n';
checklistMd += `Generated on: ${new Date().toISOString()}\n\n`;
checklistMd += `Total pending items: **${todos.length}**\n\n`;

if (todos.length === 0) {
  checklistMd += '🎉 **All content items have been filled! The site is launch-ready.**\n';
} else {
  checklistMd += '| File | Line | Item Description |\n';
  checklistMd += '|---|---|---|\n';
  for (const item of todos) {
    checklistMd += `| \`${item.file}\` | L${item.line} | ${item.message} |\n`;
  }
}

fs.writeFileSync(checklistPath, checklistMd, 'utf-8');
console.log(`📝 Generated ${checklistPath}`);

if (errors.length > 0) {
  console.error('\n❌ Content check errors:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

const isProduction = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENV === 'production';

if (todos.length > 0) {
  console.log(`\n⚠️  Found ${todos.length} pending TODO items in content files.`);
  if (isProduction) {
    console.error('❌ Production build failed: Cannot build for production with remaining TODO placeholders.');
    process.exit(1);
  } else {
    console.log('ℹ️  Non-production mode: Proceeding with build. Complete todos before launch.\n');
  }
} else {
  console.log('✅ All content items verified!');
}
