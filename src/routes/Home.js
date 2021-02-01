import Vweet from "components/Vweet";
import { dbService } from "firebase_inst";
import React, { useEffect, useState } from "react";
import NweetFactory from "../components/VweetFactory";

const Home = ({ userObj }) => {
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

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
