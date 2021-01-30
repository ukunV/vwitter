import { dbService, storageService } from "firebase_inst";
import React, { useState } from "react";

const Vweet = ({ vweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newVweet, setNewVweet] = useState(vweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this vweet?");
    if (ok) {
      await dbService.doc(`vweet/${vweetObj.id}`).delete();
      await storageService.refFromURL(vweetObj.attachmentUrl).delete();
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(vweetObj, newVweet);
    await dbService.doc(`vweet/${vweetObj.id}`).update({
      text: newVweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewVweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <from onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit you vweet"
                  value={newVweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Vweet" />
              </from>
              <button onClick={toggleEditing}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <button>
          <h4>{vweetObj.text}</h4>
          {vweetObj.attachmentUrl && (
            <img
              alt="vweet_img"
              src={vweetObj.attachmentUrl}
              width="50px"
              height="50px"
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Vweet</button>
              <button onClick={toggleEditing}>Edit Vweet</button>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default Vweet;
