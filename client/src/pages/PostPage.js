import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

export default function PostPage() {
  const [posts, setPosts] = useState(null);
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:8000/posts/${id}`)
      .then((res) => res.json())
      .then((posts) => setPosts(posts));
  }, []);

  if (!posts) {
    return <p>Loading...</p>;
  }

  return (
    <div className="post-page">
      <h1>{posts.title}</h1>
      <time>{formatISO9075(new Date(posts.createdAt))}</time>
      <div className="author">by @{posts.author.username}</div>
      {console.log(userInfo)}
      {userInfo && userInfo.id === posts.author._id && (
        <div className="edit-row">
          <Link className="edit-btn " to={`/edit/${posts._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              dataSlot="icon"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Edit this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={"http://localhost:8000/" + posts.cover} alt="post" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: posts.content }}
      />
    </div>
  );
}
