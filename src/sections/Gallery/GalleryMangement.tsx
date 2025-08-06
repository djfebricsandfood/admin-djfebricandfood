import React, { useState, useEffect } from 'react';

import {
    Box,
    Fab,
    Grid,
    Card,
    Chip,
    Alert,
    Button,
    Dialog,
    Select,
    AppBar,
    Toolbar,
    Snackbar,
    MenuItem,
    Checkbox,
    CardMedia,
    TextField,
    Typography,
    IconButton,
    Pagination,
    InputLabel,
    CardContent,
    CardActions,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions,
    InputAdornment,
    CircularProgress
} from '@mui/material';

const GalleryManagement = () => {
    // State management
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        file: null
    });
    const [previewUrl, setPreviewUrl] = useState('');

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Fetch gallery images
    const fetchImages = async (page = 1, search = '') => {
        setLoading(true);
        try {
            let url = `/api/gallery?page=${page}&limit=12&sortBy=${sortBy}&sortOrder=${sortOrder}`;
            if (search) {
                url = `/api/gallery/search?query=${search}&page=${page}&limit=12`;
            }

            const response = await fetch(url);
            const result = await response.json();

            if (result.success) {
                setImages(result.data);
                setTotalPages(result.pagination.totalPages);
                setCurrentPage(result.pagination.currentPage);
            } else {
                showSnackbar('Failed to fetch images', 'error');
            }
        } catch (error) {
            showSnackbar('Error fetching images', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchImages();
    }, [sortBy, sortOrder]);

    // Search handler
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchQuery) {
                fetchImages(1, searchQuery);
            } else {
                fetchImages(1);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    // Show snackbar
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData({ ...formData, file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Open create dialog
    const handleOpenDialog = () => {
        setEditMode(false);
        setFormData({ title: '', file: null });
        setPreviewUrl('');
        setSelectedImage(null);
        setOpenDialog(true);
    };

    // Open edit dialog
    const handleEditImage = (image) => {
        setEditMode(true);
        setFormData({ title: image.title, file: null });
        setPreviewUrl(image.imageUrl);
        setSelectedImage(image);
        setOpenDialog(true);
    };

    // View image dialog
    const handleViewImage = (image) => {
        setSelectedImage(image);
        setOpenViewDialog(true);
    };

    // Submit form
    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            showSnackbar('Please enter a title', 'error');
            return;
        }

        if (!editMode && !formData.file) {
            showSnackbar('Please select an image file', 'error');
            return;
        }

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            if (formData.file) {
                formDataToSend.append('galleryImage', formData.file);
            }

            const url = editMode ? `/api/gallery/${selectedImage._id}` : '/api/gallery';
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend
            });

            const result = await response.json();

            if (result.success) {
                showSnackbar(editMode ? 'Image updated successfully' : 'Image uploaded successfully');
                setOpenDialog(false);
                fetchImages(currentPage, searchQuery);
            } else {
                showSnackbar(result.message || 'Operation failed', 'error');
            }
        } catch (error) {
            showSnackbar('Error submitting form', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Delete single image
    const handleDeleteImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/gallery/${imageId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showSnackbar('Image deleted successfully');
                fetchImages(currentPage, searchQuery);
            } else {
                showSnackbar(result.message || 'Delete failed', 'error');
            }
        } catch (error) {
            showSnackbar('Error deleting image', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Delete multiple images
    const handleDeleteSelected = async () => {
        if (selectedImages.length === 0) {
            showSnackbar('Please select images to delete', 'error');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} selected images?`)) return;

        setLoading(true);
        try {
            const response = await fetch('/api/gallery', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: selectedImages })
            });

            const result = await response.json();

            if (result.success) {
                showSnackbar(`${result.deletedCount} images deleted successfully`);
                setSelectedImages([]);
                fetchImages(currentPage, searchQuery);
            } else {
                showSnackbar(result.message || 'Delete failed', 'error');
            }
        } catch (error) {
            showSnackbar('Error deleting images', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle image selection for bulk operations
    const handleImageSelect = (imageId) => {
        setSelectedImages(prev =>
            prev.includes(imageId)
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
        );
    };

    // Select all images
    const handleSelectAll = () => {
        if (selectedImages.length === images.length) {
            setSelectedImages([]);
        } else {
            setSelectedImages(images.map(img => img._id));
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Header */}
            <AppBar position="static" sx={{ mb: 3, borderRadius: 2 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Gallery Management
                    </Typography>
                    <Chip
                        label={`${images.length} Images`}
                        color="secondary"
                        variant="outlined"
                        sx={{ color: 'white', borderColor: 'white' }}
                    />
                </Toolbar>
            </AppBar>

            {/* Controls */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {/* <SearchIcon /> */}
                            </InputAdornment>
                        )
                    }}
                    sx={{ minWidth: 300 }}
                />

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Sort By"
                    >
                        <MenuItem value="createdAt">Date</MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Order</InputLabel>
                    <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Order"
                    >
                        <MenuItem value="desc">Newest</MenuItem>
                        <MenuItem value="asc">Oldest</MenuItem>
                    </Select>
                </FormControl>

                {selectedImages.length > 0 && (
                    <Button
                        variant="outlined"
                        color="error"
                        // startIcon={<DeleteSweepIcon />}
                        onClick={handleDeleteSelected}
                    >
                        Delete Selected ({selectedImages.length})
                    </Button>
                )}

                <Button
                    variant="outlined"
                    onClick={handleSelectAll}
                >
                    {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
                </Button>
            </Box>

            {/* Loading */}
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            {/* Images Grid */}
            <Grid container spacing={3}>
                {images.map((image) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={image._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Checkbox
                                    checked={selectedImages.includes(image._id)}
                                    onChange={() => handleImageSelect(image._id)}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        zIndex: 1,
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                    }}
                                />
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={image.imageUrl}
                                    alt={image.title}
                                    sx={{ objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => handleViewImage(image)}
                                />
                            </Box>

                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div" noWrap>
                                    {image.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Created: {new Date(image.createdAt).toLocaleDateString()}
                                </Typography>
                            </CardContent>

                            <CardActions>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleViewImage(image)}
                                >
                                    {/* <ViewIcon /> */}
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleEditImage(image)}
                                >
                                    {/* <EditIcon /> */}
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteImage(image._id)}
                                >
                                    {/* <DeleteIcon /> */}
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Empty State */}
            {!loading && images.length === 0 && (
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {searchQuery ? 'No images found for your search' : 'No images in gallery'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        {searchQuery ? 'Try a different search term' : 'Upload your first image to get started'}
                    </Typography>
                    {!searchQuery && (
                        <Button
                            variant="contained"
                            // startIcon={<AddIcon />}
                            onClick={handleOpenDialog}
                        >
                            Add First Image
                        </Button>
                    )}
                </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(e, page) => {
                            setCurrentPage(page);
                            fetchImages(page, searchQuery);
                        }}
                        color="primary"
                    />
                </Box>
            )}

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={handleOpenDialog}
            >
                {/* <AddIcon /> */}
            </Fab>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editMode ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Image Title"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        component="label"
                        variant="outlined"
                        // startIcon={<UploadIcon />}
                        fullWidth
                        sx={{ mb: 2, py: 1.5 }}
                    >
                        {formData.file ? formData.file.name : (editMode ? 'Change Image' : 'Upload Image')}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>

                    {previewUrl && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : (editMode ? 'Update' : 'Upload')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Image Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedImage?.title}
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenViewDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        {/* <CloseIcon /> */}
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedImage && (
                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src={selectedImage.imageUrl}
                                alt={selectedImage.title}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '70vh',
                                    borderRadius: '8px'
                                }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Created: {new Date(selectedImage.createdAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Updated: {new Date(selectedImage.updatedAt).toLocaleString()}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default GalleryManagement;