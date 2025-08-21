import { useParams, Link } from "react-router";
import { useState, useEffect, useContext } from "react";
import CommentForm from "../CommentForm/CommentForm";

import * as hootService from "../../services/hootService";

import { UserContext } from "../../contexts/UserContext";

import styles from './HootDetails.module.css';

const HootDetails = (props) => {
  const [hoot, setHoot] = useState(null);
  const { hootId } = useParams();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      setHoot(hootData);
    };
    fetchHoot();
  }, [hootId]);

  const handleAddComment = async (commentFormData) => {
    const newComment = await hootService.createComment(hootId, commentFormData);
    setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
  };

  const handleDeleteComment = async (commentId) => {
    console.log('commentId:', commentId);
    // connects to db, delete request
    await hootService.deleteComment(hootId, commentId);
    setHoot({
      ...hoot,
      comments: hoot.comments.filter((comment) => comment._id !== commentId),
    });
  };

  if (!hoot) return <main>Loading...</main>;

  return (
    <main className={styles.container}>
      <section>
        <header>
          <p>{hoot.category.toUpperCase()}</p>
          <h1>{hoot.title}</h1>
          <div><p>
            {`${hoot.author.username} posted on
            ${new Date(hoot.createdAt).toLocaleDateString()}`}
          </p>
          {hoot.author._id === user._id && (
            <>
              <Link to={`/hoots/${hootId}/edit`}>Edit</Link>
              <button onClick={() => props.handleDeleteHoot(hootId)}>
                Delete
              </button>
            </>
          )}</div>
        </header>
        <p>{hoot.text}</p>
      </section>
      <section>
        <h2>Comments</h2>

        <CommentForm handleAddComment={handleAddComment} />

        {!hoot.comments.length && <p>There are no comments.</p>}

        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <div><header>
              <p>
                {`${comment.author.username} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
            </header>
            </div>
            <p>{comment.text}</p>
            {comment.author._id === user._id && (
              <>
                <Link to={`/hoots/${hootId}/comments/${comment._id}/edit`}>Edit</Link>
                <button onClick={() => handleDeleteComment(comment._id)}>
                  Delete Comment
                </button>
              </>
            )}
          </article>
        ))}
      </section>
    </main>
  );
};

export default HootDetails;
