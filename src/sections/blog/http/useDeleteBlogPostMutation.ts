import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { BLOG_ENDPOINT } from 'src/http/apiEndPoints/Auth';

import { toast } from 'src/components/snackbar';

const useDeleteBlogPostMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function deleteBLogPost(id) {
    return axiosInstance.patch(`${BLOG_ENDPOINT.DeleteBlogPost}/${id}`);
  }

  return useMutation({
    mutationFn: deleteBLogPost,

    onSuccess: async (res, input) => {
      toast.success(res.data.message);

      queryClient.invalidateQueries([BLOG_ENDPOINT.GetAllBLogList]);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};

export default useDeleteBlogPostMutation;
