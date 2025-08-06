import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { maxLine } from 'src/theme/styles';

import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

type Props = {
  post: {
    _id: string;
    heading: string;
    description: string;
    image: string;
    createdAt: string;
  };
};

export function PostItemHorizontal({ post }: Props) {
  const theme = useTheme();

  const { heading, image, createdAt, description, _id } = post;

  return (
    <Card sx={{ display: 'flex' }}>
      <Stack spacing={1} sx={{ p: theme.spacing(3, 3, 2, 3), flexGrow: 1 }}>
        <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
          {fDate(createdAt)}
        </Box>

        <Stack spacing={1} flexGrow={1}>
          <Link
            component={RouterLink}
            href={paths.dashboard.post.details(_id)}
            color="inherit"
            variant="subtitle2"
            sx={{ ...maxLine({ line: 2 }) }}
          >
            {heading}
          </Link>

          <Typography variant="body2" sx={{ ...maxLine({ line: 2 }), color: 'text.secondary' }}>
            {description}
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          p: 1,
          width: 180,
          height: 240,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Image alt={heading} src={image} sx={{ height: 1, borderRadius: 1.5 }} />
      </Box>
    </Card>
  );
}