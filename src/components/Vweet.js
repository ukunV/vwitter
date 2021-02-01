import { dbService, storageService } from "firebase_inst";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
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
    <div className="vweet">
      {editing ? (
        <>
          <from onSubmit={onSubmit} className="container vweetEdit">
            <input
              type="text"
              placeholder="Edit you vweet"
              value={newVweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Vweet" className="formBtn" />
          </from>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{vweetObj.text}</h4>
          {vweetObj.attachmentUrl && (
            <img alt="vweet_img" src={vweetObj.attachmentUrl} />
          )}
          {isOwner && (
            <div class="vweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Vweet;
