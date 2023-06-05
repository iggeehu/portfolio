import Head from "next/head";
import Layout from "./layout";
import { getSortedPostsData } from "../lib/posts";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import Date from "../components/date";

// interface Post {
//     slug: string
//     title: string
//     date: string
//     coverImage: string
//     author: string
//     excerpt: string
//     ogImage: {
//       url: string
//     }
//     content: string
// }

// type Props = {
//   allPosts: Post[]
// }

export async function getStaticProps() {
  const allPostsData: any = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}


export default function Home({ allPostsData }) {
  return (
    <div className="h-full bg-silver-tree-100">
      <Head>
        <title>Tianci: Blog</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full p-10">
        <Layout>
          <section className="">
            <div className=" flex flex-cols p-10">
              <div className="notes-date basis-1/4 bg-silver-tree-200 h-96 rounded m-auto">
                <div className="py-2 px-2">
                <img src="https://miro.medium.com/v2/resize:fill:88:88/1*Odrk7Jy6oAm7HfQyBq92hA.png" alt="Tianci Hu Marrero"></img>
                
                <p><a href="https://medium.com/@iggeehu?source=post_page-----e4b26704395a--------------------------------">Tianci Hu Marrero</a></p>
                This page is still under construction
                </div>
               
              </div>
              <ul className="notes-content basis-3/4 bg-silver-tree-200 font-blog rounded-xl p-5">
                {allPostsData.map(({ id, date, title, keywords }) => (
                  <li className="" key={id}>
                    <div>
                    <Link href={`/blogs/${id}`}><p className="text-md text-silver-tre-800">{title}</p></Link>
                      <div className="text-sm text-current text-silver-tree-500">{keywords}</div>
                      <div className="text-sm">{date}</div>
                    </div>
                    <br />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Layout>
      </main>
    </div>
  );
}
