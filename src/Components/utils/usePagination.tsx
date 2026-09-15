import {
  useMemo,
  useState,
  useCallback,
  type ChangeEvent,
  type MouseEvent,
} from "react";

interface PaginationOptions {
  initialPage?: number;
  initialRowsPerPage?: number;
}

export default function usePagination<T>(
  //T: "I don't know what type of data this pagination hook will receive yet. Preserve whatever type is given to me."
  data: T[],
  options: PaginationOptions = {}
) {
  const {
    initialPage = 0,
    initialRowsPerPage = 10,
  } = options;

  const safeData = useMemo<T[]>(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  const [page, setPage] = useState<number>(initialPage);
  const [rowsPerPage, setRowsPerPage] =
    useState<number>(initialRowsPerPage);

  const totalCount = safeData.length;

  const paginatedData = useMemo<T[]>(() => {
    const start = page * rowsPerPage;

    return safeData.slice(
      start,
      start + rowsPerPage
    );
  }, [safeData, page, rowsPerPage]);

  const handleChangePage = useCallback(
    (
      event: MouseEvent<HTMLButtonElement> | null,
      newPage: number
    ) => {
      setPage(newPage);
    },
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      const next = parseInt(event.target.value, 10);

      setRowsPerPage(
        Number.isFinite(next)
          ? next
          : initialRowsPerPage
      );

      setPage(0);
    },
    [initialRowsPerPage]
  );

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

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