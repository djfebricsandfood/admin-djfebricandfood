import { useParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { ADMIN_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

import { toast } from 'src/components/snackbar';

const useUpdateProductMutation = () => {
  const { id } = useParams();

  async function updateProduct(input: FormData) {
    return axiosInstance.patch(`${ADMIN_ENDPOINTS.UpdateProduct}/${id}`, input, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: updateProduct,

    onSuccess: async (res, input) => {
      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useUpdateProductMutation;
