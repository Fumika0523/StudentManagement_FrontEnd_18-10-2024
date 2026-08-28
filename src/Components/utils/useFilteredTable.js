import { useCallback, useEffect, useMemo, useState } from "react";

export const useFilteredTable = ({ rows, filterRows, resetFilters }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const sourceRows = useMemo(() => rows || [], [rows]);

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
