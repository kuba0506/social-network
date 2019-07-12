import React, { Fragment, useEffect } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop'; 
import ProfileAbout from './ProfileAbout'; 
import ProfileExperience from './ProfileExperience'; 
import ProfileEducation from './ProfileEducation'; 
import ProfileGithubuser from './ProfileGithubuser'; 
import { getProfileById } from '../../actions/profile';

const ProfileDetails = ({
    getProfileById,
    profile: {
        profile,
        loading
    },
    repos,
    auth,
    match: {
        params: { id }
    }
}) => {
    useEffect(() => {
        getProfileById(id);
    }, [getProfileById, id]);

    return (
        <Fragment>
            {profile === null || loading ? (
                <Spinner />
            ) : (
                <Fragment>
                    <Link className="btn btn-light" to="/profiles">
                        Back to Profiles list
                    </Link>
                    {auth.isAuthenticated && !auth.loading && auth.user._id === profile.user._id && (
                        <Link className="btn btn-dark" to="/edit-profile">
                            Edit profile
                        </Link>
                    )}
                    <div className="profile-grid my-1">
                        <ProfileTop profile={profile} />
                        <ProfileAbout profile={profile} />
                        <ProfileExperience experience={profile.experience} />
                        <ProfileEducation education={profile.education} />
                        {profile.githubusername && (
                            <ProfileGithubuser username={profile.githubusername} repos={repos} />
                        )}
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

ProfileDetails.propTypes = {
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getProfileById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { getProfileById }
)(ProfileDetails);
