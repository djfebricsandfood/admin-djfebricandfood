import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { BLOG_ENDPOINT } from 'src/http/apiEndPoints/Auth';

async function getAllBlogPost(searchResults) {
  const { data } = await axiosInstance.get(BLOG_ENDPOINT.GetAllBLogList);
  return data;
}

const useGetAllBlogList = (searchResults) =>
  useQuery({
    queryKey: [BLOG_ENDPOINT.GetAllBLogList],
    queryFn: () => getAllBlogPost(searchResults),
    enabled: true,
  });

export default useGetAllBlogList;
