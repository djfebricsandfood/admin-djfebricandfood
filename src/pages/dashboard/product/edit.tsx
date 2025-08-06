import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { ProductEditView } from 'src/sections/product/view';

import useGetProductById from './http/useGetProductById';

// ----------------------------------------------------------------------

const metadata = { title: `Product edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();



  const { data: product, isLoading } = useGetProductById(id);

  console.log(product, "thois is prodcut");

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductEditView product={product?.product} />
    </>
  );
}
