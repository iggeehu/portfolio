---
id: "syncing-medium"
title: "Syncing Medium posts on NextJS site: an imperfect approach"
date: "2023-05-30"
keywords: "NextJS, Markdown, Tailwind"
---

Syncing Medium posts on NextJS site: an imperfect approach
==========================================================

[![Tianci Hu Marrero](https://miro.medium.com/v2/resize:fill:88:88/1*Odrk7Jy6oAm7HfQyBq92hA.png)

](https://medium.com/@iggeehu?source=post_page-----aaf7c0778486--------------------------------)
\
4 min read·Just now

\--

\

A few months ago, I decided to do my portfolio site in NextJS. Unluckily, I did not think I would add a blog section at the time, and rendering blogs of any other format on the site has just been a pain. (I even tried writing blogs in html, but the finger overhead of formatting in html just dampened my desire to write. This cannot be!) To make matters worse, I store all my blogs on Medium, and migrating them involved many steps:

\# MEDIUM TO BLOG WORKFLOW

1.  Convert medium posts to markdown files stored in my current working directory.
2.  Convert markdown file to html.
3.  Dynamically render the html fetched by referencing the url slug, which represents the id field of the markdown file’s YML metadata.
4.  Standardize the html to my blogging style sheet, built on tailwindCSS.

And some might say, why not just convert medium directly to html? This is because I would potentially want to write my blogs natively instead of publishing them on Medium first. So a future workflow would look like this:

\# NATIVE MARKDOWN TO SITE BLOG WORKFLOW

1.  Write blog into markdown file, stored in my /posts directory.
2.  My site reads into my /posts directory and list the articles at /posts at every render. If a html file at the /postsHtml directory exists, then render that in posts/\[id\]. If not, automatically generate the html and render it, even if it’s imperfect and unformatted.
3.  If html file at /postsHtml is not formatted, go manually format it to conform to styling standards.

Now, the final workflow described in this post will build on top of an existing solution, which exists in NextJS official site’s tutorial page. If you are familiar with NextJS already, you should start at the [“Blog Data” section of “Pre-rendering and Data Fetching” chapter](https://nextjs.org/learn/basics/data-fetching/blog-data). The tutorial will show you how to:

1.  Fetch blog metadata from a directory of markdown files with YML metadata headers. Each markdown file represents a blog post.
2.  Trigger creation of markdown-to-html conversion (by using remarkHtml, a JS library), include the html as part of the blog object.
3.  The html, fresh from remarkHtml oven, gets rendered at posts/\[id\].

Though the solution offered by nextJS’ official documentation offered me thearchitecture in which to render my blog, it has the lethal flaw of getting converted html files directly onto the page. I found that the converted html file has trouble with recognizing line breaks (I used spaces, backslashes, and nothing worked consistently). Additionally, there does not seem to be a way to pass in style attributes to the rendered html if your project uses TailwindCSS. This means that I need to stagger the process and render the html files in my directory, so I can go in and tweak them before actual publication.

So, this is my posts.js file, which is based on the next.js documentation:

```
  
import fs from 'fs';  
import path from 'path';  
import matter from 'gray-matter';  
import { remark } from 'remark';  
import html from 'remark-html';  
import {unified} from 'unified'  
import remarkParse from 'remark-parse'  
import remarkHtml from 'remark-html'  
import remarkToc from 'remark-toc'  
import remarkRehype from 'remark-rehype'  
import rehypeDocument from 'rehype-document'  
import rehypeFormat from 'rehype-format'  
import rehypeStringify from 'rehype-stringify'  
  
const postsDirectory = path.join(process.cwd(), 'posts');  
  
//for rendering /posts url for a list of posts  
export function getSortedPostsData() {  
  
  const fileNames = fs.readdirSync(postsDirectory);  
  const allPostsData = fileNames.map((fileName) => {  
    //peek into /posts directory in my current working directory  
    const id = fileName.replace(/\\.md$/, '');  
    const fullPath = path.join(postsDirectory, fileName);  
    const fileContents = fs.readFileSync(fullPath, 'utf8');  
    //fetch the yml metadata from within the markdown files  
    const matterResult = matter(fileContents);  
  
    return {  
      id,  
      ...matterResult.data,  
    };  
  });  
  // Sort posts by date  
  return allPostsData.sort((a, b) => {  
    if (a.date < b.date) {  
      return 1;  
    } else {  
      return -1;  
    }  
  });  
}  
  
//for rendering /posts url for a list of posts  
export async function getPostData(id) {  
    const fullPath = path.join(postsDirectory, \`${id}.md\`);  
    const fileContents = fs.readFileSync(fullPath, 'utf8');  
    const matterResult = matter(fileContents);  
   
    //find postsHTML directory, if such a file exists, read from such file for rendering posts/\[id\]  
    const postsHtmlDirectory = path.join(process.cwd(), 'postsHtml');  
    const htmlPath = path.join(postsHtmlDirectory, \`${id}.html\`);  
    if (fs.existsSync(htmlPath)) {  
      const contentHtml = fs.readFileSync(htmlPath, 'utf8');  
    }//if not, create html file with remark, write to html dir, and return newly generated html  
    else{  
    const processedContent = await unified()  
    .use(remarkParse)  
    .use(remarkToc)  
    .use(remarkRehype)  
    .use(rehypeDocument, {title: 'Contents'})  
    .use(rehypeFormat)  
    .use(rehypeStringify)  
      .process(matterResult.content);  
    const contentHtml = processedContent.toString();  
    fs.writeFile(\`./postsHtml/${id}.html\`, contentHtml, function (err) {})  
    }  
    return {  
      id,  
      contentHtml,  
      ...matterResult.data,  
    }  
  }  
  
  
  
    
  export function getAllPostIds() {  
    const fileNames = fs.readdirSync(postsDirectory);  
    
    return fileNames.map((fileName) => {  
      return {  
        params: {  
          id: fileName.replace(/\\.md$/, ''),  
        },  
      };  
    });  
  }  
    
  export async function getStaticPaths() {  
    const paths = getAllPostIds();  
    return {  
      paths,  
      fallback: false,  
    };  
  }
```

By doing the if/else clause in the `getPostData` function, I can have a “staggered space” (the /postsHtml directory) where I can tweak the styling of the generated html file with Tailwind.

So now workflow looks at this:

1.  Convert md file from medium (using the [medium-to-markdown](https://github.com/dtesler/medium-to-markdown) tool) or create one natively, put it under the /posts directory in my current working directory.
2.  My /posts url now shows title, id, date of my new blog post.
3.  My /posts/\[id\] shows the new blog, unformatted and wacky with linebreaks.
4.  I go into the postsHtml/ directory and edit the auto-generated html file for style.
5.  Now the formatted html shows on my blog.

Not perfect, but much better than all the other alternative! And to add a bit more detail on how I convert medium posts into md files, I npm-installed the “medium-to-markdown” package by running `npm install medium-to-markdown` . And I wrote the following script called `mediumConverter.js:`

```
const mediumToMarkdown = require('medium-to-markdown');  
const fs = require('fs');  
  
if (process.argv.length === 2) {  
    console.error('Expected at least one argument!');  
    process.exit(1);  
  }  
    
// Enter url here  
mediumToMarkdown.convertFromUrl(process.argv\[2\])  
.then((markdown) =>   
  fs.writeFile('./posts/output.md', markdown, function (err) {   
  console.error(err);})  
);
```

And every time I want to sync my medium post on my site, I just run `node mediumConverter.js [medium-post-url]`

Another thing I can do is write a script that parses the autogenerated, wacky html, adds tailwind styling based on tag name such as <div> and <code> as well as <br> if a line break is missing. But that’s for another day!