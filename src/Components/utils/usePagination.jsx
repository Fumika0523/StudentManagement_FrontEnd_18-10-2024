import { useMemo, useState } from "react";

/**
 * Reusable pagination hook for any array data.
 *
 * Usage:
 * const {
 *  page, rowsPerPage, setPage, setRowsPerPage,
 *  paginatedData, totalCount,
 *  handleChangePage, handleChangeRowsPerPage, resetPage
 * } = usePagination(data, { initialRowsPerPage: 16 });
 */
export default function usePagination(data, options = {}) {
  const { initialPage = 0, initialRowsPerPage = 10 } = options;

  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const totalCount = safeData.length;

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return safeData.slice(start, start + rowsPerPage);
  }, [safeData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    const next = parseInt(event.target.value, 10);
    setRowsPerPage(Number.isFinite(next) ? next : initialRowsPerPage);
    setPage(0);
  };

  const resetPage = () => setPage(0);

  return {
    // state
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,

    // derived
    paginatedData,
    totalCount,
    safeData,

    // handlers
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  };
}
