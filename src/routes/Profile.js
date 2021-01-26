import { authService } from "firebase_inst";
import React from "react";
import { useHistory } from "react-router-dom";

const Profile = () => {
  const history = useHistory();

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
