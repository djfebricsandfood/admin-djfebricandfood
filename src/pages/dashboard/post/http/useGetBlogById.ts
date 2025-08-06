import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { BLOG_ENDPOINT, ADMIN_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

async function getBlogById(id) {
  const { data } = await axiosInstance.get(`${BLOG_ENDPOINT.GetBlogPostById}/${id}`);
  return data?.data;
}

const useGetBlogById = (id) =>
  useQuery({
    queryKey: [ADMIN_ENDPOINTS.GetAllProduct],
    queryFn: () => getBlogById(id),
    enabled: true,
  });

export default useGetBlogById;
