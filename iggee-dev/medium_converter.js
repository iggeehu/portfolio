const mediumToMarkdown = require('medium-to-markdown');
const fs = require('fs');

if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }
  
// Enter url here
mediumToMarkdown.convertFromUrl(process.argv[2])
.then((markdown) => 
  fs.writeFile('./posts/output.md', markdown, function (err) { 
  console.error(err);})
);