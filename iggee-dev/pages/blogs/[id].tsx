import Layout from "../layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from '../../components/date';
import Head from 'next/head';

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <div className="py-3 px-20">
  
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} /></div>
    </Layout>
  );
}
