import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function Header() {
  const{setUserInfo, userInfo} = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:8000/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((userInfo) => {
        setUserInfo(userInfo);
      });
  }, []);

  const handleLogout = () => {
    fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include",
    })
        setUserInfo(null);
  };
  const username = userInfo?.username;
  return (
    <header>
      <a href="/" className="logo">
        MyBlog
      </a>
      <nav>
        {username && (
          <>
            <Link to="/create">Create Post</Link>
            <a onClick={handleLogout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
