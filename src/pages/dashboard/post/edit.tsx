import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetPost } from 'src/actions/blog';

import { PostEditView } from 'src/sections/blog/view';

import useGetBlogById from './http/useGetBlogById';

// ----------------------------------------------------------------------

const metadata = { title: `Post edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  console.log("Post ID:", id);

  const { post } = useGetPost(id);
  const { data, isLoading } = useGetBlogById(id)

  console.log(data);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PostEditView post={data} isLoading={isLoading} />
    </>
  );
}
