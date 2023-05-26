import { remark } from 'remark';
import html from 'remark-html';

if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }

const processedContent = await remark()
.use(html)
.process(process.argv[2])
.then((html) => console.log(html.toString()));
