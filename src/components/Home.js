import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import Axios from "axios";

import Page from "./Page";
import Post from "./Post";
import LoadingIcon from "./LoadingIcon";

import StateContext from "../contexts/StateContext";

function Home() {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(`/getHomeFeed`, { token: appState.user.token });

        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (e) {
        console.error("Error while fetching data.");
      }
    }

    fetchData();

    return () => {
      request.cancel();
    };
  }, [appState.user.token, setState]);

  if (state.isLoading) {
    return <LoadingIcon />;
  }

  return (
    <Page title="Your Feed">
      {state.feed.length === 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      )}

      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">The latest from those you follow</h2>
          <div className="list-group">
            {state.feed.map((post) => {
              return <Post post={post} key={post._id} />;
            })}
          </div>
        </>
      )}
    </Page>
  );
}

export default Home;
