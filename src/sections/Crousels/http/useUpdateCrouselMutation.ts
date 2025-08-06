import { useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { CROUSEL_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

import { toast } from 'src/components/snackbar';

const useUpdateCrouselMutation = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const queryClient = useQueryClient();

  async function updateCrousel(input: FormData) {
    return axiosInstance.patch(`${CROUSEL_ENDPOINTS.UpdateCrousel}/${id}`, input, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return useMutation({
    mutationFn: updateCrousel,

    onSuccess: async (res, input) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(`${CROUSEL_ENDPOINTS.GetAllCrouselList}`);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default useUpdateCrouselMutation;
