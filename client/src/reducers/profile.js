import {
    GET_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    CLEAR_PROFILES,
    CLEAR_REPOS,
    UPDATE_PROFILE
} from '../actions/types';

const initState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
};

export default function(state = initState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            };
        case GET_REPOS:
            return {
                ...state,
                repos: payload,
                loading: false
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: true
            };
        case CLEAR_PROFILES:
            return {
                ...state,
                profiles: [],
                loading: true
            };
        case CLEAR_REPOS:
            return {
                ...state,
                repos: []
            };
        default:
            return state;
    }
}
