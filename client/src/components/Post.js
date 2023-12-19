import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  summary,
  content,
  cover,
  author,
  createdAt,
}) {
  console.log(author);
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={"http://localhost:8000/" + cover} alt="post" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author ? author.username : "Unknown"}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
