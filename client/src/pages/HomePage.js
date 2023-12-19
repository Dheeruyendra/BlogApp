import Post from "../components/Post";
import React, { useEffect, useState } from "react";

export default function HomePage() {

    const[posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/posts")
      .then((res) => res.json())
      .then((posts) => setPosts(posts));
  }, []);
  return (
    <>
      {posts.length > 0 ? (
        posts.map((post) => <Post {...post} />)
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}
