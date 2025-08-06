import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { ProductDetailsSkeleton } from '../product-skeleton';
import { ProductDetailsToolbar } from '../product-details-toolbar';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { ProductDetailsDescription } from '../product-details-description';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 days replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

type SubProduct = {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
};

type Props = {
  product?: {
    _id: string;
    name: string;
    description: string;
    images: string[];
    subProducts: SubProduct[];
    createdAt: string;
    updatedAt: string;
  };
  loading?: boolean;
  error?: any;
};

export function ProductDetailsView({ product, error, loading }: Props) {
  const tabs = useTabs('description');
  const [publish, setPublish] = useState('');

  useEffect(() => {
    if (product) {
      setPublish(product?.publish || '');
    }
  }, [product]);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  if (loading) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <ProductDetailsSkeleton />
      </DashboardContent>
    );
  }

  if (error || !product) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Product not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <ProductDetailsToolbar
        backLink={paths.dashboard.product.root}
        editLink={paths.dashboard.product.edit(`${product?._id}`)}
        liveLink={paths.product.details(`${product?._id}`)}
        publish={publish}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }} sx={{ mb: 5 }}>
        {/* LEFT COLUMN: Product Carousel */}
        <Grid item xs={12} md={6} lg={7}>
          <ProductDetailsCarousel images={product?.images ?? []} />
        </Grid>

        {/* RIGHT COLUMN: Product Info + Tabs */}
        <Grid item xs={12} md={6} lg={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              {product?.name}
            </Typography>

            <Card>
              <Tabs
                value={tabs.value}
                onChange={tabs.onChange}
                sx={{
                  px: 3,
                  boxShadow: (theme) =>
                    `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                }}
              >
                <Tab value="description" label="Description" />
              </Tabs>

              {tabs.value === 'description' && (
                <Box sx={{ px: 3, py: 2 }}>
                  <ProductDetailsDescription description={product?.description ?? ''} />
                </Box>
              )}
            </Card>
          </Box>
        </Grid>
      </Grid>

      {product.subProducts.length > 0 && (
        <Card sx={{ mb: 5 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Sub Products
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {product?.subProducts?.map((subProduct) => (
                <Grid key={subProduct._id} xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Stack spacing={2}>
                      <Box
                        component="img"
                        src={`http://localhost:5000/${subProduct.image}`}
                        alt={subProduct.name}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                      <Typography variant="subtitle1">{subProduct.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(subProduct.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>
      )}


    </DashboardContent>
  );
}