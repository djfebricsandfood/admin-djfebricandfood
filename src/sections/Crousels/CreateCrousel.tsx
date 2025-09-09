import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import {
  Box, Card,
  Table,
  Stack,
  Paper,
  Button,
  Dialog,
  Tooltip,
  TableRow,
  TableBody,
  TextField,
  TableHead,
  TableCell,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  CircularProgress
} from '@mui/material';

import { imgUrl } from 'src/utils/BaseUrls';

import { LoadingScreen } from 'src/components/loading-screen';

import useCreateCrousel from './http/useCreateCrousel';
import useGetAllCrousel from './http/useGetAllCrousel';
import useDeleteCrousel from './http/useDeleteCrousel';
import useUpdateCrouselMutation from './http/useUpdateCrouselMutation';

// SVG Icons Components
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ViewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17,8 12,3 7,8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const ImageUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  '&.dragover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.light}20`,
  }
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '8px',
});

// Mock API functions (replace with actual API calls)
const mockCarousels = [
  {
    _id: '1',
    name: 'Hero Carousel',
    heading: 'Welcome to Our Platform',
    subheading: 'Discover amazing features and services',
    backgroundImage: '/api/placeholder/800/400',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Product Showcase',
    heading: 'Featured Products',
    subheading: 'Explore our latest collection',
    backgroundImage: '/api/placeholder/800/400',
    createdAt: new Date().toISOString(),
  },
];

const CarouselForm = ({ open, onClose, carousel, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    heading: '',
    subheading: '',
    backgroundImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const url = import.meta.env.VITE_IMAGE_URI

  useEffect(() => {
    if (carousel) {
      setFormData({
        name: carousel.name || '',
        heading: carousel.heading || '',
        subheading: carousel.subheading || '',
        backgroundImage: null,
      });
      setImagePreview(url + carousel.backgroundImage);
    } else {
      setFormData({
        name: '',
        heading: '',
        subheading: '',
        backgroundImage: null,
      });
      setImagePreview(null);
    }
  }, [carousel, open]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, backgroundImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const { files } = e.dataTransfer;
    if (files[0]) {
      handleImageChange(files[0]);
    }
  };



  const handleSubmit = () => {
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('heading', formData.heading);
    submitData.append('subheading', formData.subheading);
    if (formData.backgroundImage) {
      submitData.append('images', formData.backgroundImage);
    }


    onSubmit(submitData);
  };

  const isValid = formData.name && formData.heading && formData.subheading && (formData.backgroundImage || imagePreview);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {carousel ? 'Edit Carousel' : 'Create New Carousel'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Carousel Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            required
          />

          <TextField
            fullWidth
            label="Heading"
            value={formData.heading}
            onChange={handleInputChange('heading')}
            required
          />

          <TextField
            fullWidth
            label="Subheading"
            value={formData.subheading}
            onChange={handleInputChange('subheading')}
            multiline
            rows={2}
            required
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Background Image *
            </Typography>
            <ImageUploadBox
              className={dragOver ? 'dragover' : ''}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => document.getElementById('image-input').click()}
            >
              {imagePreview ? (
                <Box>
                  <PreviewImage src={imagePreview} alt="Preview" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Click to change image
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <UploadIcon />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Drop image here or click to upload
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Supports: JPG, PNG, GIF (Max 3MB)
                  </Typography>
                </Box>
              )}
            </ImageUploadBox>
            <input
              id="image-input"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValid || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {carousel ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CarouselPreview = ({ open, onClose, carousel }) => {
  if (!carousel) return null;

  const url = import.meta.env.VITE_IMAGE_URI;
  const imageUrl = `${url}${carousel.backgroundImage}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Carousel Preview</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: 'relative',
            height: '400px',
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
          }}
        >
          {/* Background Image */}
          <img
            src={imageUrl}
            alt={carousel.name || 'Carousel background'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.target.style.display = 'none';
            }}
          />

          {/* Overlay for better text readability */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 1,
            }}
          />

          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 2, px: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {carousel.heading}
            </Typography>
            <Typography variant="h6" component="p">
              {carousel.subheading}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Carousel Details:
          </Typography>
          <Typography variant="body2">
            <strong>Name:</strong> {carousel.name}
          </Typography>
          <Typography variant="body2">
            <strong>Created:</strong> {new Date(carousel.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const CarouselManagement = () => {
  const [carousels, setCarousels] = useState(mockCarousels);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCarousel, setSelectedCarousel] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { mutateAsync, isPending } = useCreateCrousel()

  const { mutateAsync: update } = useUpdateCrouselMutation()

  const { data, isLoading, refetch, isRefetching } = useGetAllCrousel()

  const { mutateAsync: deleteCarousel } = useDeleteCrousel()

  useEffect(() => {
    setCarousels(data?.data);
  }, [data]);

  const handleCreate = () => {
    setSelectedCarousel(null);
    setFormOpen(true);
  };

  const handleEdit = (carousel) => {
    setSelectedCarousel(carousel);
    setFormOpen(true);
    setSearchParams({ id: carousel._id });
  };

  const handlePreview = (carousel) => {
    setSelectedCarousel(carousel);
    setPreviewOpen(true);
  };

  const handleDelete = (carousel) => {
    setDeleteConfirm(carousel);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      deleteCarousel(deleteConfirm._id);
      setCarousels(prev => prev.filter(c => c._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (selectedCarousel) {
        update(formData).then(() => {
          setSearchParams({});
          refetch()
        })
      } else {
        const newCarousel = {
          _id: Date.now().toString(),
          name: formData.get('name'),
          heading: formData.get('heading'),
          subheading: formData.get('subheading'),
          backgroundImage: '/api/placeholder/800/400',
          createdAt: new Date().toISOString(),
        };

        mutateAsync(formData).then(() => {
          refetch()
        })
      }
      setFormOpen(false);
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const url = import.meta.env.VITE_IMAGE_URI

  if (isLoading || isRefetching) {
    return <LoadingScreen />
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Carousel Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Create and manage carousel sections for your website
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          size="large"
        >
          Create Carousel
        </Button>
      </Box>

      {/* Carousel Table */}
      {carousels?.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ImageIcon />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            No carousels found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Create your first carousel to get started
          </Typography>
          <Button variant="contained" onClick={handleCreate}>
            Create Carousel
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Preview</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Heading</TableCell>
                <TableCell>Subheading</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carousels?.map((carousel) => (
                <TableRow key={carousel._id} hover>
                  <TableCell>
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <img
                        src={`${imgUrl}/${carousel.backgroundImage}`}
                        alt={carousel.name || 'Carousel background'}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          console.error('Image failed to load:', `${imgUrl}/${carousel.backgroundImage}`);
                          e.target.style.display = 'none';
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.2)',
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {carousel.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {carousel.heading}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {carousel.subheading}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(carousel.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Preview">
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(carousel)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(carousel)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(carousel)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Form Dialog */}
      <CarouselForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSearchParams({});
        }}
        carousel={selectedCarousel}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* Preview Dialog */}
      <CarouselPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        carousel={selectedCarousel}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the carousel "{deleteConfirm?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            color="error"
            onClick={confirmDelete}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarouselManagement;