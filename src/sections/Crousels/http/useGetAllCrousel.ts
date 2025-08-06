import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { CROUSEL_ENDPOINTS } from 'src/http/apiEndPoints/Auth';

async function getAllCrousel(searchResults) {
  const { data } = await axiosInstance.get(CROUSEL_ENDPOINTS.GetAllCrouselList);
  return data;
}

const useGetAllCrousel = (searchResults) =>
  useQuery({
    queryKey: [CROUSEL_ENDPOINTS.GetAllCrouselList],
    queryFn: () => getAllCrousel(searchResults),
    enabled: true,
  });

export default useGetAllCrousel;
