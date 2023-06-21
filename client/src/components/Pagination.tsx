import React from 'react';
import './Pagination.css';

interface PaginationProps {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  paginate: Function;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalItems, itemsPerPage, paginate }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];
  const maxShownPages = 5;

  // Determine the range of page numbers to display
  let startPage = Math.max(1, page - Math.floor(maxShownPages / 2));
  let endPage = Math.min(startPage + maxShownPages - 1, totalPages);

  // Adjust the start page if necessary to always display 10 page numbers
  if (endPage - startPage < maxShownPages - 1) {
    startPage = Math.max(1, endPage - maxShownPages - 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  function prevPage() {
    if (page > 1) {
      paginate(page - 1);
    }
  }

  function nextPage() {
    if (page * itemsPerPage < totalItems) {
      paginate(page + 1);
    }
  }

  return (
    <div className="pagination">
      <span className="pagination-item" onClick={prevPage}>&laquo;</span>
      {startPage > 1 && (
        <>
          <span
            onClick={() => paginate(1)}
            className={`pagination-item ${1 === page ? 'active' : ''}`}
          >
            1
          </span>
          {startPage > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}
      {pageNumbers.map((number) => (
        <span
          key={number}
          onClick={() => paginate(number)}
          className={`pagination-item ${number === page ? 'active' : ''}`}
        >
          {number}
        </span>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
          <span
            onClick={() => paginate(totalPages)}
            className={`pagination-item ${totalPages === page ? 'active' : ''}`}
          >
            {totalPages}
          </span>
        </>
      )}
      <span className="pagination-item" onClick={nextPage}>&raquo;</span>
    </div>
  );
};

export default Pagination;
