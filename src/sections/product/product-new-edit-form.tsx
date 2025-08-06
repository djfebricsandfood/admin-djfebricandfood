import type { IProductItem } from 'src/types/product';

import { z as zod } from 'zod';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import useCreateProductMutation from './http/useCreateProductMutation';
import useUpdateProductMutation from './http/useUpdateProductMutation';

// SVG for Delete Icon
const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 2V0H15V2H20V4H18V19C18 19.5523 17.5523 20 17 20H3C2.44772 20 2 19.5523 2 19V4H0V2H5ZM4 4V18H16V4H4ZM7 7H9V15H7V7ZM11 7H13V15H11V7Z"
      fill="currentColor"
    />
  </svg>
);

// ----------------------------------------------------------------------

const SubProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Sub-product name is required!' }),
  image: schemaHelper.file({ message: { required_error: 'Sub-product image is required!' } }),
});

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  images: schemaHelper.files({ message: { required_error: 'Images is required!' } }),
  subProducts: zod.array(SubProductSchema).optional(),
});

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};


export function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();


  console.log(currentProduct, "this is current product ");


  const [setIsSubmitting] = useState(false);

  const imageUri = "http://localhost:5000"

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      subDescription: currentProduct?.subDescription || '',
      images: currentProduct?.images?.map(img => `${imageUri}/${img}`) || [],
      subProducts: currentProduct?.subProducts?.map((sub) => ({
        ...sub,
        image: sub.image ? `${imageUri}/${sub.image}` : '',
      })) || [],
    }),
    [currentProduct]
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });


  const { id } = useParams()
  console.log("Product ID:", imageUri);

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const values = watch();

  const { mutateAsync, isPending } = useCreateProductMutation()

  const { mutateAsync: update, isPending: updatePending } = useUpdateProductMutation()

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const handleAddSubProduct = useCallback(() => {
    setValue('subProducts', [...(values.subProducts || []), { name: '', image: null }]);
  }, [setValue, values.subProducts]);

  const handleRemoveSubProduct = useCallback(
    (index: number) => {
      const newSubProducts = [...(values.subProducts || [])];
      newSubProducts.splice(index, 1);
      setValue('subProducts', newSubProducts);
    },
    [setValue, values.subProducts]
  );

  const handleSubProductImageChange = useCallback(
    (index: number, file: File | null) => {
      const newSubProducts = [...(values.subProducts || [])];
      if (newSubProducts[index]) {
        newSubProducts[index].image = file;
        setValue('subProducts', newSubProducts);
      }
    },
    [setValue, values.subProducts]
  );

  const onSubmit = async (data: NewProductSchemaType) => {
    setIsSubmitting(true);
    try {

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('id', id);

      if (data.images && data.images.length > 0) {
        data.images.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`images`, file);
          }
        });
      }

      if (data.subProducts && data.subProducts.length > 0) {
        data.subProducts.forEach((subProduct, index) => {
          formData.append(`subProducts[${index}][name]`, subProduct.name);
          if (subProduct.image instanceof File) {
            formData.append(`subProducts[${index}][image]`, subProduct.image);
          }
        });
      }

      if (id) {
        update(formData).then(() => {

          router.push(paths.dashboard.product.root);
        })


      } else {
        mutateAsync(formData).then(() => {
          toast.success(currentProduct ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.product.root);
        })
      }




    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Title, short description, image..." sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Product name" />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Content</Typography>
          <Field.Editor name="description" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Images</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderSubProducts = (
    <Card>
      <CardHeader
        title="Sub-Products"
        subheader="Add variations or related products"
        action={
          <Button
            variant="contained"
            onClick={handleAddSubProduct}
            sx={{ mr: 2 }}
          >
            Add Sub-Product
          </Button>
        }
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        {values.subProducts?.map((subProduct, index) => (
          <Stack key={index} spacing={2} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Sub-Product #{index + 1}</Typography>
              <IconButton
                onClick={() => handleRemoveSubProduct(index)}
                color="error"
                aria-label="delete sub-product"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>

            <Field.Text
              name={`subProducts.${index}.name`}
              label="Sub-product name"
              fullWidth
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Image</Typography>
              <Field.Upload
                name={`subProducts.${index}.image`}
                maxSize={3145728}
                onUpload={(file) => handleSubProductImageChange(index, file)}
                onRemove={() => handleSubProductImageChange(index, null)}
                thumbnail
              />
            </Stack>
          </Stack>
        ))}

        {(!values.subProducts || values.subProducts.length === 0) && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No sub-products added yet. Click the button above to add one.
          </Typography>
        )}
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderSubProducts}

        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending || updatePending}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {isPending || updatePending ? 'Submitting...' : 'Submit Product'}
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}