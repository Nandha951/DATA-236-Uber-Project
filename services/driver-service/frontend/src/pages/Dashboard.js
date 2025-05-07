import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Grid,
    CircularProgress,
    Container,
} from '@mui/material';
import { fetchProfile } from '../store/slices/driverSlice';
import CurrentStatus from '../components/CurrentStatus';
import CurrentLocation from '../components/CurrentLocation';
import RideHistory from '../components/RideHistory';
import { useSnackbar } from 'notistack';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { user, loading, error } = useSelector((state) => state.driver);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                await dispatch(fetchProfile()).unwrap();
            } catch (error) {
                enqueueSnackbar(error || 'Failed to load profile', {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        };
        loadProfile();
    }, [dispatch, enqueueSnackbar]);

    // Show error message if there's an error
    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, {
                variant: 'error',
                autoHideDuration: 3000
            });
        }
    }, [error, enqueueSnackbar]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <CurrentStatus />
                </Grid>
                <Grid item xs={12}>
                    <CurrentLocation />
                </Grid>
                <Grid item xs={12}>
                    <RideHistory />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 