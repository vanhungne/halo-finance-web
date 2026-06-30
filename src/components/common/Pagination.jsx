import { Button } from "../ui/button";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  typeItem,
  onPageChange
}) {
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2 p-4 bg-white rounded-xl shadow">
      <div className="text-xs sm:text-sm text-slate-500">
        Hiển thị {startIndex}-{endIndex} trong tổng số {totalItems} {typeItem}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="text-xs"
        >
          Trước
        </Button>

        <span className="text-xs sm:text-sm">
          Trang {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="text-xs"
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
