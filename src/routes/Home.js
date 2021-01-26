import { dbService } from "firebase_inst";
import React, { useState } from "react";

const Home = () => {
  const [vweet, setVweet] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("vweets").add({
      vweet: vweet,
      createdAt: Date.now(),
    });
    setVweet("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setVweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={vweet}
          onChange={onChange}
          type="text"
          placeholder="what's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Vweet" />
      </form>
    </div>
  );
};

export default Home;
