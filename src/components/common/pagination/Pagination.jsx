import ReactPaginate from "react-paginate";
import "./pagination.css"; // custom style (bạn có thể dùng Tailwind nếu muốn)

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
  className = "",
}) => {
  return (
    <ReactPaginate
      previousLabel={"Prev"}
      nextLabel={"Next"}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={(event) => onPageChange(event.selected)}
      forcePage={currentPage}
      containerClassName={`pagination ${className}`}
      activeClassName={"active"}
      disabledClassName={"disabled"}
    />
  );
};

export default Pagination;
