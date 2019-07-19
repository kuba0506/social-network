import { GET_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, ADD_COMMENT, REMOVE_COMMENT } from '../actions/types';

const initState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
};

export default function(state = initState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                error: {},
                loading: false
            };
        case GET_POST:
            return {
                ...state,
                post: payload,
                error: {},
                loading: false
            };
        case ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts],
                error: {},
                loading: false
            };
        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                error: {},
                loading: false
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post._id === payload.id ? { ...post, likes: payload.likes } : post
                ),
                error: {},
                loading: false
            };
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        case ADD_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: payload },
                error: {},
                loading: false
            };
        case REMOVE_COMMENT:
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: state.post.comments.filter(c => c._id !== payload)
                },
                error: {},
                loading: false
            };
        default:
            return state;
    }
}
