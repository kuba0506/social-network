import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    CLEAR_PROFILES,
    CLEAR_REPOS,
    ACCOUNT_DELETED
} from './types';

// get current user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        });
    }
};

export const getAllProfiles = () => async dispatch => {
    dispatch({
        type: CLEAR_PROFILES
    });

    try {
        const res = await axios.get('/api/profile');
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        });
    }
};

export const getProfileById = userId => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        });
    }
};

export const getGithubRepos = githubUsername => async dispatch => {
    dispatch({
        type: CLEAR_REPOS
    });
    try {
        const res = await axios.get(`/api/profile/github/${githubUsername}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        });
    }
};

// create or update a profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'));

        // redirect if new profile has been created
        if (!edit) history.push('/dashboard');
    } catch (e) {
        const errors = e.response.data.errors;
        console.log(errors);

        if (errors) {
            errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        });
    }
};

// add experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience added', 'success'));

        // redirect
        history.push('/dashboard');
    } catch (e) {
        const errors = e.response.data.errors;

        if (errors) {
            errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        });
    }
};

// add education
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education added', 'success'));

        // redirect
        history.push('/dashboard');
    } catch (e) {
        const errors = e.response.data.errors;

        if (errors) {
            errors.forEach(e => dispatch(setAlert(e.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        });
    }
};

// delete experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience deleted', 'success'));
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        });
    }
};

// delete education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education deleted', 'success'));
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: e.response.statusText,
                status: e.response.status
            }
        });
    }
};

// DELETE ACCOUNT AND PROFILE
export const deleteAccount = id => async dispatch => {
    if (window.confirm('Are you sure? THIS CANNOT BE UNDONE')) {
        try {
            await axios.delete(`/api/profile`);

            dispatch({
                type: CLEAR_PROFILE
            });
            dispatch({
                type: ACCOUNT_DELETED
            });

            dispatch(setAlert('Your account has been deleted'));
        } catch (e) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: e.response.statusText,
                    status: e.response.status
                }
            });
        }
    }
};
