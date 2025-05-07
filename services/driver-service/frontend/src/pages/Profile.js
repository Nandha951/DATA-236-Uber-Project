import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { updateProfile } from '../store/slices/driverSlice';
import { useSnackbar } from 'notistack';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    vehicleDetails: Yup.object({
        make: Yup.string().required('Make is required'),
        model: Yup.string().required('Model is required'),
        year: Yup.number()
            .min(1900, 'Year must be after 1900')
            .max(new Date().getFullYear(), 'Year cannot be in the future')
            .required('Year is required'),
        color: Yup.string().required('Color is required'),
        licensePlate: Yup.string().required('License plate is required'),
    }),
});

const Profile = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useSelector((state) => state.driver);
    const [profileImage, setProfileImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    // Fetch profile image when component mounts or user changes
    React.useEffect(() => {
        if (user?.profileImage?.fileId) {
            // Append fileId as a query parameter to bust cache
            const url = `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/drivers/profile/image/${user._id}?v=${user.profileImage.fileId}`;
            setImageUrl(url);
        } else {
            setImageUrl(null); // Clear image URL if no fileId
        }
    }, [user]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Create FormData object for multipart/form-data
            const formData = new FormData();

            // Add text fields
            formData.append('name', values.name);
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('vehicleDetails', JSON.stringify(values.vehicleDetails));

            // Add profile image if selected
            if (profileImage) {
                // Convert base64 to blob
                const response = await fetch(profileImage);
                const blob = await response.blob();
                formData.append('profileImage', blob, 'profile.jpg');
            }

            await dispatch(updateProfile(formData)).unwrap();
            enqueueSnackbar('Profile updated successfully', {
                variant: 'success',
                autoHideDuration: 3000
            });
        } catch (error) {
            enqueueSnackbar(error || 'Failed to update profile', {
                variant: 'error',
                autoHideDuration: 3000
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Profile Settings
                </Typography>

                <Formik
                    initialValues={{
                        name: user?.name || '',
                        phoneNumber: user?.phoneNumber || '',
                        vehicleDetails: {
                            make: user?.vehicleDetails?.make || '',
                            model: user?.vehicleDetails?.model || '',
                            year: user?.vehicleDetails?.year || '',
                            color: user?.vehicleDetails?.color || '',
                            licensePlate: user?.vehicleDetails?.licensePlate || '',
                        },
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Avatar
                                            src={profileImage || imageUrl}
                                            sx={{ width: 150, height: 150, mb: 2 }}
                                            imgProps={{
                                                crossOrigin: 'anonymous'
                                            }}
                                        />
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="profile-image-upload"
                                            type="file"
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="profile-image-upload">
                                            <IconButton
                                                color="primary"
                                                component="span"
                                                sx={{ mt: 1 }}
                                            >
                                                <PhotoCamera />
                                            </IconButton>
                                        </label>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                name="name"
                                                label="Name"
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.name && Boolean(errors.name)}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                name="phoneNumber"
                                                label="Phone Number"
                                                value={values.phoneNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                                helperText={touched.phoneNumber && errors.phoneNumber}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom>
                                                Vehicle Details
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                name="vehicleDetails.make"
                                                label="Make"
                                                value={values.vehicleDetails.make}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                    touched.vehicleDetails?.make &&
                                                    Boolean(errors.vehicleDetails?.make)
                                                }
                                                helperText={
                                                    touched.vehicleDetails?.make &&
                                                    errors.vehicleDetails?.make
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                name="vehicleDetails.model"
                                                label="Model"
                                                value={values.vehicleDetails.model}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                    touched.vehicleDetails?.model &&
                                                    Boolean(errors.vehicleDetails?.model)
                                                }
                                                helperText={
                                                    touched.vehicleDetails?.model &&
                                                    errors.vehicleDetails?.model
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                name="vehicleDetails.year"
                                                label="Year"
                                                type="number"
                                                value={values.vehicleDetails.year}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                    touched.vehicleDetails?.year &&
                                                    Boolean(errors.vehicleDetails?.year)
                                                }
                                                helperText={
                                                    touched.vehicleDetails?.year &&
                                                    errors.vehicleDetails?.year
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                name="vehicleDetails.color"
                                                label="Color"
                                                value={values.vehicleDetails.color}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                    touched.vehicleDetails?.color &&
                                                    Boolean(errors.vehicleDetails?.color)
                                                }
                                                helperText={
                                                    touched.vehicleDetails?.color &&
                                                    errors.vehicleDetails?.color
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                name="vehicleDetails.licensePlate"
                                                label="License Plate"
                                                value={values.vehicleDetails.licensePlate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                    touched.vehicleDetails?.licensePlate &&
                                                    Boolean(errors.vehicleDetails?.licensePlate)
                                                }
                                                helperText={
                                                    touched.vehicleDetails?.licensePlate &&
                                                    errors.vehicleDetails?.licensePlate
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={isSubmitting}
                                                sx={{ mt: 2 }}
                                            >
                                                Update Profile
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
};

export default Profile; 