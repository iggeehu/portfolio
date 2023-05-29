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
  const allPostsData: any = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

//temporarily put any type on allPostsData
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
              <div className="notes-date basis-1/4 bg-silver-tree-200 h-96 rounded">
                (This page is still under construction, check back periodically!)
              </div>
              <ul className="notes-content basis-3/4 bg-silver-tree-200 font-blog rounded-xl p-5">
                {allPostsData.map(({ id, date, title, keywords }) => (
                  <li className="" key={id}>
                    <div>
                    <Link href={`/blogs/${id}`}>{title}</Link>
                      <br />
                      <div className="text-sm text-current text-orange-400">{keywords}</div>
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