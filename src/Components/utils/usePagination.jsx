import { useMemo, useState, useCallback } from "react";

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

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    const next = parseInt(event.target.value, 10);
    setRowsPerPage(Number.isFinite(next) ? next : initialRowsPerPage);
    setPage(0);
  }, [initialRowsPerPage]);

  const resetPage = useCallback(() => setPage(0), []);

  return {
    page,
    rowsPerPage,
    paginatedData,
    totalCount,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
  };
}
