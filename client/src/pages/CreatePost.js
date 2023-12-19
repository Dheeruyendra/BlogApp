import { useState } from "react";
import {useNavigate} from "react-router-dom"; 
import Editor from "../components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();

  async function createNewPost(event) {
    const formData = new FormData();
    formData.set("title", title);
    formData.set("summary", summary);
    formData.set("content", content);
    formData.set("file", files[0]);
    event.preventDefault();

    const response = await fetch("http://localhost:8000/createpost", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if(response.ok){
      navigate("/");
    }
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
      />
      <input type="file" onChange={(event) => setFiles(event.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ margin: "5px" }} type="submit">
        Create Post
      </button>
    </form>
  );
}
