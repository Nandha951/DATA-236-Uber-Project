import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { updateLocation } from '../store/slices/driverSlice';
import { useSnackbar } from 'notistack';

const CurrentLocation = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { location, loading } = useSelector((state) => state.driver);
    const [watchId, setWatchId] = useState(null);
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    const startLocationTracking = () => {
        if (!navigator.geolocation) {
            enqueueSnackbar('Geolocation is not supported by your browser', {
                variant: 'error',
                autoHideDuration: 3000
            });
            return;
        }

        // First get the current position
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    await dispatch(updateLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    })).unwrap();

                    // Then start watching position
                    const id = navigator.geolocation.watchPosition(
                        async (position) => {
                            try {
                                await dispatch(updateLocation({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                })).unwrap();
                            } catch (error) {
                                console.error('Location update error:', error);
                                enqueueSnackbar(error || 'Failed to update location', {
                                    variant: 'error',
                                    autoHideDuration: 3000
                                });
                            }
                        },
                        (error) => {
                            console.error('Geolocation error:', error);
                            enqueueSnackbar('Error getting location: ' + error.message, {
                                variant: 'error',
                                autoHideDuration: 3000
                            });
                            stopLocationTracking();
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                        }
                    );

                    setWatchId(id);
                    setIsTracking(true);
                } catch (error) {
                    console.error('Initial location update error:', error);
                    enqueueSnackbar(error || 'Failed to update initial location', {
                        variant: 'error',
                        autoHideDuration: 3000
                    });
                }
            },
            (error) => {
                console.error('Initial geolocation error:', error);
                enqueueSnackbar('Error getting initial location: ' + error.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    const stopLocationTracking = () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
            setIsTracking(false);
        }
    };

    const formatCoordinates = () => {
        if (!location?.coordinates) {
            return 'Location not available';
        }
        const [longitude, latitude] = location.coordinates;
        return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    };

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn color="primary" />
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Current Location
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatCoordinates()}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant={isTracking ? 'outlined' : 'contained'}
                    color={isTracking ? 'error' : 'primary'}
                    onClick={isTracking ? stopLocationTracking : startLocationTracking}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : isTracking ? (
                        'Stop Tracking'
                    ) : (
                        'Start Tracking'
                    )}
                </Button>
            </Box>
        </Paper>
    );
};

export default CurrentLocation; 