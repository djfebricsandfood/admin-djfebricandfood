import { useMutation, useQueryClient } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { CROUSEL_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

import { toast } from 'src/components/snackbar';

async function createCrousel(input: FormData) {
  return axiosInstance.post(CROUSEL_ENDPOINTS.CreateCrousel, input, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

const useCreateCrousel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCrousel,
    onSuccess: async (res, input) => {
      toast.success(res.data.message);
      // invalidate cache for carousel list
      queryClient.invalidateQueries([CROUSEL_ENDPOINTS.GetAllCrouselList]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    },
  });
};

export default useCreateCrousel;
