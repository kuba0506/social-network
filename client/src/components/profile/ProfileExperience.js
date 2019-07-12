import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({ experience }) => {
    return (
        <Fragment>
            <div className="profile-exp bg-white p-2">
                <h2 className="text-primary">Experience</h2>
                {experience.length > 0 ? (
                    <Fragment>
                        {experience.map((e, i) => (
                            <div key={i}>
                                <h3 className="text-dark">{e.company}</h3>
                                <p>
                                    <Moment format="YYYY/MM/DD">{e.from}</Moment> -{' '}
                                    {!e.to ? 'Now' : <Moment format="YYYY/MM/DD">{e.to}</Moment>}
                                </p>
                                <p>
                                    <strong>Position: </strong>
                                    {e.title}
                                </p>
                                <p>
                                    <strong>Description: </strong>
                                    {e.description}
                                </p>
                            </div>
                        ))}
                    </Fragment>
                ) : (
                    <h4>No experience found</h4>
                )}
            </div>
        </Fragment>
    );
};

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired
};

export default ProfileExperience;
