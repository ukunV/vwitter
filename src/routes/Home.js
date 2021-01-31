import Vweet from "components/Vweet";
import { dbService, storageService } from "firebase_inst";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [vweet, setVweet] = useState("");
  const [vweets, setVweets] = useState([]);
  const [attachment, setAttachment] = useState("");

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
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const vweetObj = {
      text: vweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("vweets").add(vweetObj);
    setVweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setVweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment(null);

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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Vweet" />
        {attachment && (
          <div>
            <img
              alt="vweet_image"
              src={attachment}
              width="50px"
              height="50px"
            />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
