import { useCallback, useEffect, useMemo, useState } from "react";

interface UseFilteredTableOptions<T> {
  rows?: T[];
  //filterRows must be a function that receives an array and returns an array of the same type.
  filterRows: (rows: T[]) => T[];
  resetFilters: () => void;
}

export const useFilteredTable = <T>({
  rows,
  filterRows,
  resetFilters,
}: UseFilteredTableOptions<T>) => {
 // means filteredData must contain the same type as rows.
  const [filteredData, setFilteredData] = useState<T[]>([]);
  //filteredData // Student[], displayData  // Student[]
  const [showTable, setShowTable] = useState<boolean>(false);

  const sourceRows = useMemo<T[]>(
    () => rows ?? [],
    [rows]
  );

  const applyFilters = useCallback(() => {
    setFilteredData(filterRows(sourceRows));
    setShowTable(true);
  }, [filterRows, sourceRows]);

  const resetTable = useCallback(() => {
    resetFilters();
    setFilteredData([]);
    setShowTable(false);
  }, [resetFilters]);

  useEffect(() => {
    if (showTable) {
      setFilteredData(filterRows(sourceRows));
    }
  }, [filterRows, showTable, sourceRows]);

  return {
    displayData: showTable ? filteredData : sourceRows,
    filteredData,
    showTable,
    applyFilters,
    resetTable,
  };
};