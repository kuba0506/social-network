import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../actions/post';

const Posts = ({ getPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return loading ? (
        <Spinner />
    ) : (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
            <p className="lead">
                <i className="fas fa-user" />
                Welcome to the community
            </p>
            {/*Post form*/}
            <PostForm />
            <div className="posts">
                {posts.length > 0 && posts.map((post, i) => <PostItem key={i} post={post} showActions={true} />)}
            </div>
        </Fragment>
    );
};

Posts.propTypes = {
    post: PropTypes.object.isRequired,
    getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(
    mapStateToProps,
    { getPosts }
)(Posts);
