import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useContext(UserContext);

  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetch("http://localhost:8000/login", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Login successful") {
            setUserInfo((prevUserInfo) => ({
              ...prevUserInfo,
              username: data.username,
            }));
            toast.success(data.message);
            navigate("/");
          } else {
            toast.error(data.message);
          }
        });
    } catch (error) {
      console.log(error);
      toast.error("Error in logging in!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login">
      <h1>Login</h1>
      <input
        type="text"
        name="username"
        placeholder="username"
        value={formValues.username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        value={formValues.password}
        onChange={handleChange}
      />
      <button>Login</button>
    </form>
  );
}
