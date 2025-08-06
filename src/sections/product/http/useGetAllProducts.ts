import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { ADMIN_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

async function getAllProducts() {
  const { data } = await axiosInstance.get(ADMIN_ENDPOINTS.GetAllProduct);
  return data;
}

const useGetAllProducts = () =>
  useQuery({
    queryKey: [ADMIN_ENDPOINTS.GetAllProduct],
    queryFn: getAllProducts,
    enabled: true,
  });

export default useGetAllProducts;
