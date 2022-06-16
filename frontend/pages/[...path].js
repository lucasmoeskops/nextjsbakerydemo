import { getPageDataByPath } from '../wagtail/api/private';

import Base from "../components/Base";

export async function getStaticPaths() {
  // Optionally define paths that should always pre-render here
  const paths = []
  return { paths, fallback: true }
}

export async function getStaticProps({params}) {
  let data = null;
  const path = params ? params.path[params.path.length-1] : null; // select last path
  try {
    data = await getPageDataByPath(params?.path?.join('/') || '/');
  } catch (e) {
    console.log(`Failed to obtain data :-(: ${e.message}`)
  }

  return {
    props: {
      path,
      data,
      revalidate: 43200,  // Rebuild after 12 hours by default
    },
  }
}


export default function Generic(props) {
  return (
    <Base {...props} id="main" />
  )
}