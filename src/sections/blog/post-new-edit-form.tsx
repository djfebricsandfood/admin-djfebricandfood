import type { IPostItem } from 'src/types/blog';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { imageUrl } from 'src/utils/helper';

import { toast } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import useCreateBLogMutation from './http/useCreateBLogMutation';
import useUpdateblogMutation from './http/useUpdateblogMutation';

// ----------------------------------------------------------------------

export type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

export const NewPostSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  coverUrl: schemaHelper.file({ message: { required_error: 'Cover is required!' } }),
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function PostNewEditForm({ currentPost, isLoading }: Props) {
  const router = useRouter();
  const preview = useBoolean();
  const { mutateAsync, isPending } = useCreateBLogMutation();
  const { mutateAsync: updateMutateAsync, isPending: isPendingUpdate } = useUpdateblogMutation();



  const defaultValues = useMemo(
    () => ({
      title: currentPost?.heading || '',
      description: currentPost?.description || '',
      coverUrl: `${imageUrl}${currentPost?.image}` || null,
    }),
    [currentPost]
  );

  const methods = useForm<NewPostSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('heading', data.title);
      formData.append('description', data.description);
      if (data.coverUrl) {
        formData.append('image', data.coverUrl);
      }
      if (currentPost) {
        await updateMutateAsync(formData);
      } else {
        await mutateAsync(formData);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      preview.onFalse();
      router.push(paths.dashboard.post.root);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  });

  const handleRemoveFile = useCallback(() => {
    setValue('coverUrl', null);
  }, [setValue]);



  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Title, short description, image..." sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title" label="Post title" />
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Content</Typography>
          <Field.Editor name="description" sx={{ maxHeight: 480 }} />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Cover Image</Typography>
          <Field.Upload
            name="coverUrl"
            maxSize={3145728}
            onDelete={handleRemoveFile}
            accept={{ 'image/*': [] }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <div>
        <Button color="inherit" variant="outlined" size="large" onClick={preview.onTrue}>
          Preview
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          disabled={!isValid}
          sx={{ ml: 2 }}
        >
          {!currentPost ? 'Create post' : 'Save changes'}
        </LoadingButton>
      </div>
    </Box>
  );

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderActions}
      </Stack>

      {/* <PostDetailsPreview
        isValid={isValid}
        onSubmit={onSubmit}
        title={values.title}
        open={preview.value}
        onClose={preview.onFalse}
        coverUrl={values.coverUrl}
        isSubmitting={isSubmitting}
        description={values.description}
      /> */}
    </Form>
  );
}