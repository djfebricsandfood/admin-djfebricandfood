import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { ADMIN_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

import { toast } from 'src/components/snackbar';

const useGetDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  async function deleteProduct(id) {
    return axiosInstance.patch(`${ADMIN_ENDPOINTS.DeleteProduct}/${id}`);
  }

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: async (res, input) => {
      toast.success(res.data.message);

      queryClient.invalidateQueries([ADMIN_ENDPOINTS.GetAllProduct]);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};

export default useGetDeleteProductMutation;
