import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { CROUSEL_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

import { toast } from 'src/components/snackbar';

const useDeleteCrousel = () => {
  const queryClient = useQueryClient();

  async function deleteCrousel(id) {
    return axiosInstance.patch(`${CROUSEL_ENDPOINTS.DeleteCrousel}/${id}`);
  }

  return useMutation({
    mutationFn: deleteCrousel,

    onSuccess: async (res, input) => {
      toast.success(res.data.message);

      queryClient.invalidateQueries([CROUSEL_ENDPOINTS.GetAllCrouselList]);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};

export default useDeleteCrousel;
