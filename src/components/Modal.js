import React from "react";

const Modal = ({ item, onClose }) => {
  let profilePic = item.profile_picture_url;
  profilePic =
    profilePic.split(":")[0] === "https"
      ? profilePic
      : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="profile-image">
          <img src={profilePic} alt={item.name} />
        </div>
        <div className="profile-details">
          <div className="user-name">{item.name}</div>
          <div className="user-bio">{item.bio}</div>
          <div className="user-company">
            <p className="company-name">{item.company}</p>
            <span> • </span>
            <p className="user-experience">{item.time}</p>
          </div>
          <div className="user-location">
            {item.Country && item.City !== item.Country
              ? `${item.City}, ${item.Country}`
              : `${item.City}`}
          </div>
          <div className="user-from">From: {item.from || "Amardeep"}</div>
        </div>
        <i className="fa-solid fa-xmark close-btn" onClick={onClose}></i>
      </div>
    </div>
  );
};

export default Modal;
