import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { BLOG_ENDPOINT } from 'src/http/apiEndPoints/Auth';

import { toast } from 'src/components/snackbar';

async function createBlogPost(input: FormData) {
  return axiosInstance.post(BLOG_ENDPOINT.CreateBlogPost, input, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

const useCreateBLogMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createBlogPost,

    onSuccess: async (res, input) => {
      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useCreateBLogMutation;
