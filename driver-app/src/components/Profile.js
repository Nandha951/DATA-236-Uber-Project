import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, fetchProfile } from '../store/slices/driverSlice';
import { updateUserData } from '../store/slices/authSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const { user: driver, loading: driverLoading, error: driverError } = useSelector((state) => state.driver);
    const { user: authUser, loading: authLoading } = useSelector((state) => state.auth);
    const [profileImage, setProfileImage] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [isFetchingProfile, setIsFetchingProfile] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Effect 1: Set profile image from authUser (localStorage) for quick initial display
    useEffect(() => {
        if (authUser?.profileImageData) {
            setProfileImage(authUser.profileImageData);
            console.log('Profile.js: Image set from authUser (localStorage cache)', { imageLength: authUser.profileImageData?.length });
        } else if (authUser && !authUser.profileImageData) {
            // If authUser is loaded but has no image, ensure profileImage is null
            setProfileImage(null);
            console.log('Profile.js: authUser (localStorage cache) has no image.');
        }
    }, [authUser]);

    // Effect 2: Fetch fresh profile data from server on component mount
    useEffect(() => {
        const fetchProfileFromServer = async () => {
            console.log('Profile.js: Attempting to fetch profile from server...');
            setIsFetchingProfile(true);
            setLocalError(null);
            try {
                const resultAction = await dispatch(fetchProfile());
                if (fetchProfile.fulfilled.match(resultAction)) {
                    const driverDataFromServer = resultAction.payload;
                    console.log('Profile.js: Successfully fetched profile from server', {
                        hasImage: !!driverDataFromServer?.profileImageData,
                        imageLength: driverDataFromServer?.profileImageData?.length
                    });
                    if (driverDataFromServer?.profileImageData) {
                        setProfileImage(driverDataFromServer.profileImageData);
                        dispatch(updateUserData(driverDataFromServer)); // Update authUser & localStorage
                    } else {
                        // Server confirms no image, or driverData is null
                        setProfileImage(null);
                        // Ensure authUser and localStorage reflect no image if driverDataFromServer is valid but has no image
                        if (driverDataFromServer) {
                            dispatch(updateUserData({ ...driverDataFromServer, profileImageData: null }));
                        } else {
                            // If driverDataFromServer is null/undefined (e.g. new user not yet in driver collection)
                            // We might want to clear any stale image in authUser if one existed.
                            // However, updateUserData with just {profileImageData: null} might be risky if authUser is also null.
                            // Let's assume fetchProfile returns the full driver object or null.
                            // If it's a new user that successfully logged in but profile is not yet created,
                            // driverDataFromServer might be minimal or null.
                            // authUser should be updated based on what login provides.
                            // If fetchProfile indicates "no profile" for a logged-in user, we should clear image.
                            if (authUser) { // Only update if authUser exists
                                dispatch(updateUserData({ ...(authUser || {}), profileImageData: null }));
                            }
                        }
                    }
                } else {
                    const errorMessage = resultAction.payload || 'Failed to load profile data from server.';
                    console.error('Profile.js: Failed to fetch profile from server - rejected.', { errorMessage, resultAction });
                    setLocalError(errorMessage);
                }
            } catch (error) {
                console.error('Profile.js: Exception during profile fetch.', error);
                setLocalError('An error occurred while fetching your profile.');
            } finally {
                setIsFetchingProfile(false);
            }
        };

        if (authUser) { // Only fetch profile if user is authenticated
            fetchProfileFromServer();
        }
    }, [dispatch, authUser?.id]); // Re-fetch if authUser.id changes (e.g. re-login as different user)

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('Profile.js: Image selected for upload:', { name: file.name, type: file.type, size: file.size });
        setIsUpdatingProfile(true);
        setLocalError(null);

        // Create a preview URL for the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result); // Show local preview immediately
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const resultAction = await dispatch(updateProfile(formData));
            if (updateProfile.fulfilled.match(resultAction)) {
                const updatedDriver = resultAction.payload;
                console.log('Profile.js: Profile update successful.', {
                    hasImage: !!updatedDriver?.profileImageData,
                    imageLength: updatedDriver?.profileImageData?.length
                });
                if (updatedDriver?.profileImageData) {
                    setProfileImage(updatedDriver.profileImageData); // Set image from server response
                    dispatch(updateUserData(updatedDriver)); // Update authUser & localStorage
                } else {
                    setProfileImage(null); // Server confirms no image after update
                    if (updatedDriver) {
                        dispatch(updateUserData({ ...updatedDriver, profileImageData: null }));
                    } else if (authUser) {
                        dispatch(updateUserData({ ...authUser, profileImageData: null }));
                    }
                    setLocalError('Profile updated, but no image data was returned.');
                }
            } else {
                const errorMessage = resultAction.payload || 'Failed to update profile.';
                console.error('Profile.js: Profile update failed - rejected.', { errorMessage, resultAction });
                setLocalError(errorMessage);
                // Revert to previous image if upload fails and we were showing a preview
                // This needs originalImage to be stored if we want to revert.
                // For now, if authUser has an image, try to set it back.
                if (authUser?.profileImageData) setProfileImage(authUser.profileImageData);
            }
        } catch (error) {
            console.error('Profile.js: Exception during image upload.', error);
            setLocalError('An error occurred while uploading your image.');
            if (authUser?.profileImageData) setProfileImage(authUser.profileImageData);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleImageError = () => {
        console.error('Profile.js: Error loading <img> tag for profile image. Source was:', profileImage?.substring(0, 100) + '...');
        setProfileImage(null); // Clear image if it fails to load
        setLocalError('Failed to display profile image.');
    };

    const isLoading = driverLoading || authLoading || isFetchingProfile || isUpdatingProfile;
    const currentError = driverError || localError;

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    if (currentError) {
        return <div>Error: {typeof currentError === 'string' ? currentError : JSON.stringify(currentError)}</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-image-container">
                    {profileImage ? (
                        <img
                            // Keying the image can help force re-render if src string is identical but content changed,
                            // but base64 data URLs change if content changes. Not strictly needed here if profileImage state updates correctly.
                            // key={Date.now()}
                            src={profileImage}
                            alt="Profile"
                            className="profile-image"
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="profile-image-placeholder">
                            <i className="fas fa-user"></i> {/* Consider adding an actual icon library if not already used */}
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="profile-image-input"
                        style={{ display: 'none' }}
                        disabled={isLoading}
                    />
                    <label
                        htmlFor="profile-image-input"
                        className={`upload-button ${isLoading ? 'disabled' : ''}`}
                    >
                        {isUpdatingProfile ? 'Updating...' : (isFetchingProfile ? 'Loading...' : 'Change Photo')}
                    </label>
                </div>
                {/* Display other profile details here */}
                {/* Example: <h3>{authUser?.name || 'Driver Name'}</h3> */}
            </div>
        </div>
    );
};

export default Profile; 