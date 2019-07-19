import axios from 'axios';
import { GET_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, ADD_COMMENT, REMOVE_COMMENT } from './types';
import { setAlert } from './alert';

// get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data
        });
    } catch (e) {
        const message = e.response.data.message ? e.response.data.message : e.response.statusText;

        dispatch(setAlert(message, 'danger'));
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: message,
                status: e.response.status
            }
        });
    }
};

// get posts
export const getPost = postId => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${postId}`);

        dispatch({
            type: GET_POST,
            payload: res.data
        });
    } catch (e) {
        const message = e.response.data.message ? e.response.data.message : e.response.statusText;

        dispatch(setAlert(message, 'danger'));
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: message,
                status: e.response.status
            }
        });
    }
};

// add like
export const addLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id: postId, likes: res.data }
        });
    } catch (e) {
        const message = e.response.data.message ? e.response.data.message : e.response.statusText;

        dispatch(setAlert(message, 'danger'));
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: message,
                status: e.response.status
            }
        });
    }
};

// remove like
export const removeLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: { id: postId, likes: res.data }
        });
    } catch (e) {
        const message = e.response.data.message ? e.response.data.message : e.response.statusText;

        dispatch(setAlert(message, 'danger'));
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: message,
                status: e.response.status
            }
        });
    }
};

// delete post
export const deletePost = postId => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postId}`);

        dispatch({
            type: DELETE_POST,
            payload: postId
        });
        dispatch(setAlert('Post removed', 'success'));
    } catch (e) {
        const message = e.response.data.message ? e.response.data.message : e.response.statusText;

        dispatch(setAlert(message, 'danger'));
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: message,
                status: e.response.status
            }
        });
    }
};

// add post
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.post(`/api/posts`, formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data
        });
        dispatch(setAlert('Post created', 'success'));
    } catch (e) {
        const message = e.response.data.message ? e.response.data.message : e.response.statusText;

        dispatch(setAlert(message, 'danger'));
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: message,
                status: e.response.status
            }
        });
    }
};

// add post
export const addComment = (postId, text) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.post(`/api/posts/comment/${postId}`, text, config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });
        dispatch(setAlert('Comment added', 'success'));
    } catch (e) {
        const message = e.response.data.message ? e.response.data.message : e.response.statusText;

        dispatch(setAlert(message, 'danger'));
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: message,
                status: e.response.status
            }
        });
    }
};

// add post
export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        });
        dispatch(setAlert('Comment removed', 'success'));
    } catch (e) {
        const message = e.response.data.message ? e.response.data.message : e.response.statusText;

        dispatch(setAlert(message, 'danger'));
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: message,
                status: e.response.status
            }
        });
    }
};
