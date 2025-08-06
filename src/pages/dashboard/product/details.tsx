import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { ProductDetailsView } from 'src/sections/product/view';

import useGetProductById from './http/useGetProductById';

// ----------------------------------------------------------------------

const metadata = { title: `Product details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { data: product, isLoading, isError } = useGetProductById(id)

  console.log(product?.product, "this is from details page")


  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductDetailsView product={product?.product} loading={isLoading} error={isError} />
    </>
  );
}
