import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { ADMIN_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

async function getProductById(id) {
  const { data } = await axiosInstance.get(`${ADMIN_ENDPOINTS.GetProductById}/${id}`);
  return data?.data;
}

const useGetProductById = (id) =>
  useQuery({
    queryKey: [ADMIN_ENDPOINTS.GetAllProduct],
    queryFn: () => getProductById(id),
    enabled: true,
  });

export default useGetProductById;
