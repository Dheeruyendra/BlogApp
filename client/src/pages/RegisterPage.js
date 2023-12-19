import React, { useState } from "react";
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    if (event.target.type === "text") {
      setUsername(event.target.value);
    } else if (event.target.type === "password") {
      setPassword(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
    await fetch("http://localhost:8000/register", {
      method: "POST",
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
          if(data.message === "Username already exists"){
            toast.error(data.message)
          }else{
            toast.success("Registered Successfully!")
            navigate("/login");
          }
      });

  }catch(error){
    toast.error("Error in registering!")
  };
  }
  return (
    <form onSubmit={handleSubmit} className="register">
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={handleChange}
      />
      <button>Register</button>
    </form>
  );
}
