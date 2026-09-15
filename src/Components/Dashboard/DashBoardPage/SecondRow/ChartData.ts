// ========================================
// CHART DATA TYPE
// ========================================

/*
 * Each object represents one month's
 * sample earning value for the chart.
 */
export interface LineDataItem {
  id: number;

  month: string;

  earning: number;
}


// ========================================
// STATIC CHART DATA
// ========================================

/*
 * Explicit typing makes sure every chart
 * item keeps the same structure.
 */
export const lineData: LineDataItem[] = [
  {
    id: 1,
    month: "Jan",
    earning: 0,
  },
  {
    id: 2,
    month: "Feb",
    earning: 10000,
  },
  {
    id: 3,
    month: "Mar",
    earning: 5000,
  },
  {
    id: 4,
    month: "Apr",
    earning: 15000,
  },
  {
    id: 5,
    month: "May",
    earning: 10000,
  },
  {
    id: 6,
    month: "Jun",
    earning: 20000,
  },
  {
    id: 7,
    month: "Jul",
    earning: 15000,
  },
  {
    id: 8,
    month: "Aug",
    earning: 25000,
  },
  {
    id: 9,
    month: "Sep",
    earning: 20000,
  },
  {
    id: 10,
    month: "Oct",
    earning: 30000,
  },
  {
    id: 11,
    month: "Nov",
    earning: 25000,
  },
  {
    id: 12,
    month: "Dec",
    earning: 40000,
  },
];