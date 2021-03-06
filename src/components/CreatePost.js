import React, { useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { Redirect } from "react-router-dom";

import DispatchContext from "../contexts/DispatchContext";
import StateContext from "../contexts/StateContext";

function CreatePost(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  async function createPost(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: appState.user.token,
      });

      setIsSuccessful(response.data);
    } catch (e) {
      console.error("Error while saving post.");
    }
  }

  if (isSuccessful) {
    appDispatch({ type: "flashMessage", value: "Congrats, you successfully created a post!" });
    return <Redirect to={`/post/${isSuccessful}`}></Redirect>;
  }

  return (
    <Page title="Create New Post">
      <form onSubmit={createPost}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={(e) => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={(e) => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Create</button>
      </form>
    </Page>
  );
}

export default CreatePost;
