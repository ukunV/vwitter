import { dbService } from "firebase_inst";
import React, { useState } from "react";

const Vweet = ({ vweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newVweet, setNewVweet] = useState(vweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this vweet?");
    if (ok) {
      await dbService.doc(`vweet/${vweetObj.id}`).delete();
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
      ) : (
        <button>
          <h4>{vweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Vweet</button>
              <button>Edit Vweet</button>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default Vweet;
