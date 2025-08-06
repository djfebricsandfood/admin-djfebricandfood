import { useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';

import axiosInstance from 'src/utils/axios';

import { BLOG_ENDPOINT } from 'src/http/apiEndPoints/Auth';

import { toast } from 'src/components/snackbar';

const useUpdateblogMutation = () => {

  const { id } = useParams();

  async function updateBlogPost(input: FormData) {
    return axiosInstance.patch(`${BLOG_ENDPOINT.UpdateBlogPost}/${id}`, input, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: updateBlogPost,

    onSuccess: async (res, input) => {
      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useUpdateblogMutation;
