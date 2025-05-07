import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box
} from '@mui/material';
import { fetchRides } from '../store/slices/driverSlice';
import { useSnackbar } from 'notistack';

const RideHistory = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { rides, ridesLoading, ridesError } = useSelector((state) => state.driver);

    useEffect(() => {
        const loadRides = async () => {
            try {
                await dispatch(fetchRides()).unwrap();
            } catch (error) {
                enqueueSnackbar(error || 'Failed to load ride history', {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        };

        loadRides();
    }, [dispatch, enqueueSnackbar]);

    // Show error message if there's an error
    useEffect(() => {
        if (ridesError) {
            enqueueSnackbar(ridesError, {
                variant: 'error',
                autoHideDuration: 3000
            });
        }
    }, [ridesError, enqueueSnackbar]);

    if (ridesLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Ride History
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Passenger</TableCell>
                            <TableCell>Pickup</TableCell>
                            <TableCell>Dropoff</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Fare</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rides.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No rides found
                                </TableCell>
                            </TableRow>
                        ) : (
                            rides.map((ride) => (
                                <TableRow key={ride._id}>
                                    <TableCell>
                                        {new Date(ride.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {ride.passenger?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {ride.pickupLocation?.address || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {ride.dropoffLocation?.address || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {ride.status}
                                    </TableCell>
                                    <TableCell>
                                        ${ride.fare?.toFixed(2) || 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default RideHistory; 