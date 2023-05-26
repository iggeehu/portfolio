const mediumToMarkdown = require('medium-to-markdown');


if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }
  
// Enter url here
mediumToMarkdown.convertFromUrl(process.argv[2])
.then((markdown) => 
  console.log(markdown)//=> Markdown content of medium post
);