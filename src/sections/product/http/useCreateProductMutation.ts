import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { ADMIN_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

import { toast } from 'src/components/snackbar';

async function createProduct(input: FormData) {
  return axiosInstance.post(ADMIN_ENDPOINTS.CreateProduct, input, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

const useCreateProductMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: async (res, input) => {
      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useCreateProductMutation;
