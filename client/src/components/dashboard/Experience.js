import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
    const experiences = experience.map(e => (
        <tr key={e._id}>
            <td>{e.company}</td>
            <td className="hide-sm">{e.title}</td>
            <td>
                <Moment format="YYYY/MM/DD">{e.from}</Moment> -{' '}
                {e.to === null ? 'now' : <Moment format="YYYY/MM/DD">{e.to}</Moment>}
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteExperience(e._id)}>
                    Delete
                </button>
            </td>
        </tr>
    ));

    return (
        <Fragment>
            <h2 className="my-2">Experience credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{experiences}</tbody>
            </table>
        </Fragment>
    );
};

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired
};

export default connect(
    null,
    { deleteExperience }
)(Experience);
