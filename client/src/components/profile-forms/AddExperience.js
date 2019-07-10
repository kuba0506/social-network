import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExperience } from '../../actions/profile';
import { Link, withRouter } from 'react-router-dom';

const AddExperience = ({addExperience, history}) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        from: '',
        current: false,
        to: '',
        description: ''
    });

    const { title, company, location, from, current, to, description } = formData;

    const onChange = e => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = e => {
        e.preventDefault();
        addExperience(formData, history);
    };

    return (
        <Fragment>
            <h1 className="large text-primary">Add An Experience</h1>
            <p className="lead">
                <i className="fas fa-code-branch" /> Add any developer/programming positions that you have had in
                the past
            </p>
            <small>* = required field</small>
            <form className="form" noValidate onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Job Title"
                        name="title"
                        value={title}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Company"
                        name="company"
                        value={company}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Location"
                        name="location"
                        value={location}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input type="date" name="from" value={from} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <p>
                        <input
                            type="checkbox"
                            name="current"
                            value={current}
                            checked={current}
                            onChange={() => {
                                setFormData({ ...formData, current: !current });
                                console.log(current);
                            }}
                        />{' '}
                        Current Job
                    </p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input type="date" name="to" value={to} onChange={e => onChange(e)} disabled={current} />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Job Description"
                        value={description}
                        onChange={e => onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary my-1" value="Submit" />
                <Link className="btn btn-light my-1" to="/dashboard">
                    Go Back
                </Link>
            </form>
        </Fragment>
    );
};

AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired
};

export default connect(
    null,
    { addExperience }
)(withRouter(AddExperience));
