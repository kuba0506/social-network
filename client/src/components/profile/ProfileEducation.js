import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({ education }) => {
    return (
        <Fragment>
            <div className="profile-edu bg-white p-2">
                <h2 className="text-primary">Education</h2>
                {education.length > 0 ? (
                    <Fragment>
                        {education.map((e, i) => (
                            <div key={i}>
                                <h3 className="text-dark">{e.school}</h3>
                                <p>
                                    <Moment format="YYYY/MM/DD">{e.from}</Moment> -{' '}
                                    {!e.to ? 'Now' : <Moment format="YYYY/MM/DD">{e.to}</Moment>}
                                </p>
                                <p>
                                    <strong>Degree: </strong>{e.degree}
                                </p>
                                <p>
                                    <strong>Field Of Study: </strong>{e.fieldofstudy}
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

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired
};

export default ProfileEducation;
