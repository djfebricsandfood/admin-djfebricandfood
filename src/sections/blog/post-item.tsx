import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { imageUrl } from 'src/utils/helper';
import { fDate } from 'src/utils/format-time';

import { maxLine } from 'src/theme/styles';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import useDeleteBlogPostMutation from './http/useDeleteBlogPostMutation';

// ----------------------------------------------------------------------

type PostItemProps = {
  post: {
    _id: string;
    heading: string;
    description: string;
    image: string;
    createdAt: string;
  };
  onDelete?: (id: string) => void;
};

export function PostItem({ post, onDelete }: PostItemProps) {
  const theme = useTheme();
  const router = useRouter();
  const ImageUrl = import.meta.env.VITE_IMAGE_URI;
  const linkTo = paths.post.details(post._id);

  const { mutateAsync } = useDeleteBlogPostMutation()

  const handleEdit = () => {
    router.push(paths.dashboard.post.edit(post._id));
  };

  const handleDelete = () => {
    mutateAsync(post._id)
  };

  return (
    <Card>
      <Image alt={post.heading} src={`${imageUrl}${post.image}`} ratio="4/3" />

      <CardContent>
        <Typography variant="caption" component="div" sx={{ mb: 1, color: 'text.disabled' }}>
          {fDate(post.createdAt)}
        </Typography>

        <Link
          component={RouterLink}
          href={linkTo}
          color="inherit"
          variant="subtitle2"
          sx={{ ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }) }}
        >
          {post.heading}
        </Link>

        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          {post.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleEdit} aria-label="edit">
          <Iconify icon="eva:edit-fill" />
        </IconButton>
        <IconButton onClick={handleDelete} aria-label="delete" color="error">
          <Iconify icon="eva:trash-2-fill" />
        </IconButton>
      </CardActions>
    </Card>
  );
}

// ----------------------------------------------------------------------

type PostItemLatestProps = {
  post: {
    _id: string;
    heading: string;
    description: string;
    image: string;
    createdAt: string;
  };
  index: number;
  onDelete?: (id: string) => void;
};

export function PostItemLatest({ post, index, onDelete }: PostItemLatestProps) {
  const theme = useTheme();
  const router = useRouter();
  const linkTo = paths.post.details(post._id);
  const postSmall = index === 1 || index === 2;

  const handleEdit = () => {
    router.push(paths.dashboard.post.edit(post._id));
  };

  const handleDelete = () => {
    console.log("sadasdasd")
    if (onDelete) {
      onDelete(post._id);
    }
  };

  return (
    <Card sx={{ position: 'relative' }}>
      <Image
        alt={post.heading}
        src={post.image}
        ratio="4/3"
        sx={{ height: 360 }}
      />

      <CardContent
        sx={{
          width: 1,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Typography variant="caption" component="div" sx={{ mb: 1, opacity: 0.64 }}>
          {fDate(post.createdAt)}
        </Typography>

        <Link
          component={RouterLink}
          href={linkTo}
          color="inherit"
          variant={postSmall ? 'subtitle2' : 'h5'}
          sx={{
            ...maxLine({
              line: 2,
              persistent: postSmall ? theme.typography.subtitle2 : theme.typography.h5,
            }),
          }}
        >
          {post.heading}
        </Link>

        <Typography variant="body2" sx={{ mt: 1, opacity: 0.64, color: 'common.white' }}>
          {post.description}
        </Typography>
      </CardContent>

      <CardActions sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 1
      }}>
        <IconButton onClick={handleEdit} aria-label="edit" sx={{ color: 'common.white' }}>
          <Iconify icon="eva:edit-fill" />
        </IconButton>
        <IconButton
          onClick={handleDelete}
          aria-label="delete"
          sx={{ color: 'error.light' }}
        >
          <Iconify icon="eva:trash-2-fill" />
        </IconButton>
      </CardActions>
    </Card>
  );
}