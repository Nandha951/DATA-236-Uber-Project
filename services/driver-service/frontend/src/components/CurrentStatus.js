import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    CircularProgress,
} from '@mui/material';
import { updateStatus } from '../store/slices/driverSlice';
import { useSnackbar } from 'notistack';

const statusColors = {
    online: 'success',
    offline: 'error',
    busy: 'warning',
};

const CurrentStatus = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { status, loading } = useSelector((state) => state.driver);

    const handleStatusChange = async (newStatus) => {
        try {
            await dispatch(updateStatus(newStatus)).unwrap();
            enqueueSnackbar(`Status updated to ${newStatus}`, {
                variant: 'success',
                autoHideDuration: 3000
            });
        } catch (error) {
            enqueueSnackbar(error || 'Failed to update status', {
                variant: 'error',
                autoHideDuration: 3000
            });
        }
    };

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Current Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: `${statusColors[status]}.main`,
                            }}
                        />
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                            {status}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                            variant={status === 'online' ? 'contained' : 'outlined'}
                            color="success"
                            onClick={() => handleStatusChange('online')}
                            disabled={loading || status === 'online'}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Go Online'}
                        </Button>
                        <Button
                            variant={status === 'offline' ? 'contained' : 'outlined'}
                            color="error"
                            onClick={() => handleStatusChange('offline')}
                            disabled={loading || status === 'offline'}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Go Offline'}
                        </Button>
                        <Button
                            variant={status === 'busy' ? 'contained' : 'outlined'}
                            color="warning"
                            onClick={() => handleStatusChange('busy')}
                            disabled={loading || status === 'busy'}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Set Busy'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default CurrentStatus; 