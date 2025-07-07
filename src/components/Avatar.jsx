import React from "react";

const Avatar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="flex items-center gap-2">
      <img
        src={user?.photoURL}
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
      <span className="font-medium text-sm">{user?.displayName}</span>
    </div>
  );
};

export default Avatar;
