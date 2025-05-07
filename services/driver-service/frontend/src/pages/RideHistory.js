import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { Star as StarIcon } from '@mui/icons-material';
import { fetchRideHistory } from '../store/slices/rideSlice';
import { useSnackbar } from 'notistack';

const statusColors = {
    completed: 'success',
    cancelled: 'error',
    in_progress: 'warning',
    pending: 'info',
};

const RideHistory = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { rides, loading } = useSelector((state) => state.ride);

    useEffect(() => {
        const loadRides = async () => {
            try {
                await dispatch(fetchRideHistory()).unwrap();
            } catch (error) {
                enqueueSnackbar(error || 'Failed to load ride history', {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        };
        loadRides();
    }, [dispatch, enqueueSnackbar]);

    const columns = [
        { field: 'id', headerName: 'Ride ID', width: 100 },
        {
            field: 'pickupLocation',
            headerName: 'Pickup',
            width: 200,
            valueGetter: (params) => params.row.pickupLocation.address,
        },
        {
            field: 'dropoffLocation',
            headerName: 'Dropoff',
            width: 200,
            valueGetter: (params) => params.row.dropoffLocation.address,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={statusColors[params.value]}
                    size="small"
                />
            ),
        },
        {
            field: 'fare',
            headerName: 'Fare',
            width: 100,
            valueGetter: (params) => `$${params.row.fare.toFixed(2)}`,
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 120,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ color: 'gold', mr: 0.5 }} />
                    {params.value ? params.value.toFixed(1) : 'N/A'}
                </Box>
            ),
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 180,
            valueGetter: (params) =>
                new Date(params.row.createdAt).toLocaleString(),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="View Details">
                    <IconButton
                        size="small"
                        onClick={() => handleViewDetails(params.row)}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    const handleViewDetails = (ride) => {
        // TODO: Implement ride details view
        console.log('View ride details:', ride);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Ride History
                </Typography>
                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={rides}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                        disableSelectionOnClick
                        loading={loading}
                    />
                </div>
            </Paper>
        </Box>
    );
};

export default RideHistory; 