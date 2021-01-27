import Vweet from "components/Vweet";
import { dbService } from "firebase_inst";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [vweet, setVweet] = useState("");
  const [vweets, setVweets] = useState([]);

  // const getVweets = async () => {
  //   const dbVweets = dbService.collection("vweets").get();
  //   dbVweets.forEach((document) => {
  //     const vweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     setVweets((prev) => [vweetObject, ...prev]);
  //   });
  // };

  useEffect(() => {
    dbService.collection("vweets").onSnapshot((snapshot) => {
      const vweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVweets(vweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("vweets").add({
      text: vweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
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
      <div key={vweet.id}>
        {vweets.map((vweet) => (
          <Vweet
            key={vweet.id}
            vweetObj={vweet}
            isOwner={vweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
