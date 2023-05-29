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

export function getSortedPostsData() {

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

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

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
 
    //find postsHTML directory, if such a file exists, read from such file
    const postsHtmlDirectory = path.join(process.cwd(), 'postsHtml');
    const htmlPath = path.join(postsHtmlDirectory, `${id}.html`);
    if (fs.existsSync(htmlPath)) {
      const htmlContents = fs.readFileSync(htmlPath, 'utf8');
      return {
        id,
        contentHtml: htmlContents,
        ...matterResult.data,
      };
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
    fs.writeFile(`./postsHtml/${id}.html`, contentHtml, function (err) {});
    //
    return {
      id,
      contentHtml,
      ...matterResult.data,
    };}
  }

  export async function mdToHtml(id) {
    
  }

  export async function writeHtmlFile(id) {
    const htmlContent = await getPostData(id).contentHtml
    fs.writeFile(`./postsHtml/${id}.md`, htmlContent, function (err) { 
      console.error(err);})
  }


  
  export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
  
    return fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
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
  