import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getGithubRepos } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const ProfileGithubuser = ({ username, getGithubRepos, repos }) => {
    useEffect(() => {
        getGithubRepos(username);
    }, [getGithubRepos, username]);

    return (
        <Fragment>
            <div className="profile-github">
                <h2 className="text-primary my-1">
                    <i className="fab fa-github" /> Github Repos
                </h2>
                {repos.length === 0 ? (
                    <Spinner />
                ) : (
                    repos.map((repo, i) => {
                        return (
                            <div key={i} className="repo bg-white p-1 my-1">
                                <div>
                                    <h4>
                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                            {repo.name}
                                        </a>
                                    </h4>
                                    {repo.description && <p>{repo.description}</p>}
                                </div>
                                <div>
                                    <ul>
                                        <li className="badge badge-primary">Stars: {repo.stargazers_count}</li>
                                        <li className="badge badge-dark">Watchers: {repo.watchers_count}</li>
                                        <li className="badge badge-light">Forks: {repo.forks_count}</li>
                                    </ul>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Fragment>
    );
};

ProfileGithubuser.propTypes = {
    repos: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    getGithubRepos: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    repos: state.profile.repos
});

export default connect(
    mapStateToProps,
    { getGithubRepos }
)(ProfileGithubuser);
