import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    Box,
    Alert,
    Grid,
} from '@mui/material';
import { register } from '../store/slices/authSlice';
import { useSnackbar } from 'notistack';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    phoneNumber: Yup.string()
        .matches(/^\+?[\d\s-]+$/, 'Invalid phone number')
        .required('Phone number is required'),
    licenseNumber: Yup.string().required('License number is required'),
    vehicleDetails: Yup.object({
        make: Yup.string().required('Vehicle make is required'),
        model: Yup.string().required('Vehicle model is required'),
        year: Yup.number()
            .min(1900, 'Invalid year')
            .max(new Date().getFullYear(), 'Invalid year')
            .required('Vehicle year is required'),
        color: Yup.string().required('Vehicle color is required'),
        licensePlate: Yup.string().required('License plate is required'),
    }),
});

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            await dispatch(register(values)).unwrap();
            enqueueSnackbar('Registration successful', { variant: 'success' });
            navigate('/login');
        } catch (error) {
            setErrors({ submit: error.message });
            enqueueSnackbar(error.message, { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Driver Registration
                    </Typography>
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            password: '',
                            phoneNumber: '',
                            licenseNumber: '',
                            vehicleDetails: {
                                make: '',
                                model: '',
                                year: '',
                                color: '',
                                licensePlate: '',
                            },
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            isSubmitting,
                        }) => (
                            <Form style={{ width: '100%', marginTop: '1rem' }}>
                                {errors.submit && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {errors.submit}
                                    </Alert>
                                )}
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="name"
                                            label="Full Name"
                                            name="name"
                                            autoComplete="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="phoneNumber"
                                            label="Phone Number"
                                            name="phoneNumber"
                                            autoComplete="tel"
                                            value={values.phoneNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                            helperText={touched.phoneNumber && errors.phoneNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="licenseNumber"
                                            label="License Number"
                                            name="licenseNumber"
                                            value={values.licenseNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.licenseNumber && Boolean(errors.licenseNumber)}
                                            helperText={touched.licenseNumber && errors.licenseNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                            Vehicle Details
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="vehicleDetails.make"
                                            label="Vehicle Make"
                                            name="vehicleDetails.make"
                                            value={values.vehicleDetails.make}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                touched.vehicleDetails?.make &&
                                                Boolean(errors.vehicleDetails?.make)
                                            }
                                            helperText={
                                                touched.vehicleDetails?.make && errors.vehicleDetails?.make
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="vehicleDetails.model"
                                            label="Vehicle Model"
                                            name="vehicleDetails.model"
                                            value={values.vehicleDetails.model}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                touched.vehicleDetails?.model &&
                                                Boolean(errors.vehicleDetails?.model)
                                            }
                                            helperText={
                                                touched.vehicleDetails?.model && errors.vehicleDetails?.model
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="vehicleDetails.year"
                                            label="Vehicle Year"
                                            name="vehicleDetails.year"
                                            type="number"
                                            value={values.vehicleDetails.year}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                touched.vehicleDetails?.year &&
                                                Boolean(errors.vehicleDetails?.year)
                                            }
                                            helperText={
                                                touched.vehicleDetails?.year && errors.vehicleDetails?.year
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="vehicleDetails.color"
                                            label="Vehicle Color"
                                            name="vehicleDetails.color"
                                            value={values.vehicleDetails.color}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                touched.vehicleDetails?.color &&
                                                Boolean(errors.vehicleDetails?.color)
                                            }
                                            helperText={
                                                touched.vehicleDetails?.color && errors.vehicleDetails?.color
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="vehicleDetails.licensePlate"
                                            label="License Plate"
                                            name="vehicleDetails.licensePlate"
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
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Registering...' : 'Register'}
                                </Button>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Link component={RouterLink} to="/login" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Box>
        </Container>
    );
}

export default Register; 