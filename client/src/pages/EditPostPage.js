import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"; 
import Editor from "../components/Editor";

export default function EditPostPage() {
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
     fetch(`http://localhost:8000/posts/${id}`)
     .then((response) => response.json())
     .then((data) => {
         setTitle(data.title);
         setSummary(data.summary);
         setContent(data.content);
     }); 
  }, []);

  async function updatePost(event){
    const formData = new FormData();
    formData.set("title", title);
    formData.set("summary", summary);
    formData.set("content", content);
    formData.set('id', id);

    if(files?.[0]){
    formData.set("file", files?.[0]);
    }
    event.preventDefault();
      await fetch('http://localhost:8000/post/', {
          method: "PUT",
          body: formData,
          credentials: "include",
      }).then((response) => {
        console.log(response);
          if(response.ok){
              navigate(`/post/${id}`);
          }
      });
  }

  return (
    <form onSubmit={updatePost}>
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
        Update Post
      </button>
    </form>
  );

}   