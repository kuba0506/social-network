import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
    profile: {
        bio,
        skills,
        user: { name }
    }
}) => {
    return (
        <Fragment>
            <div className="profile-about bg-light p-2">
                {bio && (
                    <Fragment>
                        <h2 className="text-primary">{name.trim().split(' ')[0]} Bio</h2>
                        <p>{bio}</p>
                    </Fragment>
                )}
                <div className="line" />
                <h2 className="text-primary">Skill Set</h2>
                <div className="skills">
                    {skills.map((s, i) => (
                        <div className="p-1" key={i}>
                            <i className="fa fa-check" /> {s}
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
};

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ProfileAbout;
