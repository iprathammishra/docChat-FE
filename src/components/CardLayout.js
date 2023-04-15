import React, { useState } from "react";
import Modal from "./Modal";
import ReactPaginate from "react-paginate";

const CardLayout = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const displayItems = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div>
      {displayItems.map((item, index) => (
        <div
          key={index}
          className="card"
          onClick={(e) => {
            setSelectedItem(item);
          }}
        >
          <div>
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
              rel="noreferrer"
              target="_blank"
              href={item.link}
              className="name"
            >
              {item.name}
            </a>
          </div>
          <div className="bio">{item.bio}</div>
          <div className="location">{item.location}</div>
        </div>
      ))}
      {selectedItem && (
        <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      <ReactPaginate
        pageCount={Math.ceil(data.length / itemsPerPage)}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
        ageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        previousLabel="<"
        nextLabel=">"
      />
    </div>
  );
};

export default CardLayout;
