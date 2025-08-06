import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PostListHomeView } from 'src/sections/blog/view';
import useGetAllBlogList from 'src/sections/blog/http/useGetAllBlogList';

// ----------------------------------------------------------------------

const metadata = { title: `Post list - ${CONFIG.site.name}` };

export default function Page() {





  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PostListHomeView />
    </>
  );
}
