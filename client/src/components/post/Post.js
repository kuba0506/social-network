import React, { Fragment, useEffect } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import { getPost } from '../../actions/post';
import CommentItem from './CommentItem';

const Post = ({ getPost, post: { post, loading }, match }) => {
    const postId = match.params.id;

    useEffect(() => {
        getPost(postId);
    }, [getPost, postId]);

    return loading || post === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <Link to="/posts" className="btn">Back to posts</Link>
            <PostItem showActions={false} post={post} />
            <CommentForm postId={postId}/>
            {post.comments.map(c => (
                <CommentItem key={c._id} comment={c} postId={post._id} />
            ))}
        </Fragment>
    );
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(
    mapStateToProps,
    { getPost }
)(Post);
