#!/usr/bin/env node
// Injects header-template.html into all docs/*.html files.
// Run after editing header-template.html: node scripts/inject-header.js
// Safe to run multiple times — strips the old injected block before re-injecting.

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const templatePath = path.join(docsDir, 'header-template.html');

if (!fs.existsSync(templatePath)) {
    console.error('Error: docs/header-template.html not found');
    process.exit(1);
}

const template = '\n' + fs.readFileSync(templatePath, 'utf8').trimEnd() + '\n';
const CONTAINER = '<div id="header-container"></div>';
const START_MARKER = '<!-- HEADER-START -->';
const END_MARKER = '<!-- HEADER-END -->';

const files = fs.readdirSync(docsDir)
    .filter(f => f.endsWith('.html') && f !== 'header-template.html')
    .map(f => path.join(docsDir, f));

let count = 0;
for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes(CONTAINER)) {
        console.log(`  skip  ${path.basename(filePath)} (no header-container)`);
        continue;
    }

    // Strip previously injected block if present
    const startIdx = content.indexOf(START_MARKER);
    const endIdx = content.indexOf(END_MARKER);
    if (startIdx !== -1 && endIdx !== -1) {
        content = content.slice(0, startIdx) + content.slice(endIdx + END_MARKER.length);
    }

    // Inject after the container div
    const insertAt = content.indexOf(CONTAINER) + CONTAINER.length;
    content = content.slice(0, insertAt) + template + content.slice(insertAt);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓     ${path.basename(filePath)}`);
    count++;
}

console.log(`\nDone — updated ${count} file(s).`);
