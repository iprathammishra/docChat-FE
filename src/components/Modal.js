import React from "react";

const Modal = ({ item, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="profile-image">
          <img src={item.profile_picture_url} alt={item.name} />
        </div>
        <div className="profile-details">
          <div className="user-name">{item.name}</div>
          <div className="user-bio">{item.bio}</div>
          <div className="user-company">
            <p className="company-name">{item.company}</p>
            <span> • </span>
            <p className="user-experience">{item.experience}</p>
          </div>
          <div className="user-location">{item.location}</div>
          <div className="user-from">From: {item.from || "Amardeep"}</div>
        </div>
        <i className="fa-solid fa-xmark close-btn" onClick={onClose}></i>
      </div>
    </div>
  );
};

export default Modal;
