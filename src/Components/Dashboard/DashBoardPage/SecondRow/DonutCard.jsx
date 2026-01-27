import React, { useMemo } from "react";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Card from "react-bootstrap/Card";

Chart.register(ArcElement, Tooltip, Legend, Title);

function DonutCard({ admissionData = [], month, year }) {
  const data = useMemo(() => {
    // if year not selected, fallback to current year
    const selectedYear = year ? Number(year) : new Date().getFullYear();

    // month is optional. If not selected => whole year data.
    const monthIndex = month
      ? new Date(`${month} 1, ${selectedYear}`).getMonth()
      : null;

    const inScope = admissionData.filter((item) => {
      if (!item?.admissionDate) return false;
      const d = new Date(item.admissionDate);
      if (isNaN(d)) return false;

      if (d.getFullYear() !== selectedYear) return false;
      if (monthIndex === null) return true; // year total

      return d.getMonth() === monthIndex;
    });

    const counts = { Social: 0, Referral: 0, Direct: 0 };

    inScope.forEach((item) => {
      const src = item.admissionSource;
      if (src in counts) counts[src] += 1;
    });

    return {
      labels: ["Social", "Referral", "Direct"],
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc"],
          borderWidth: 2,
        },
      ],
    };
  }, [admissionData, month, year]);
// inside DonutCard, after `data` is created
const total = data?.datasets?.[0]?.data?.reduce((sum, n) => sum + n, 0) || 0;

const periodLabel =
  year && month ? `${month} ${year}`
  : year ? `${year}`
  : "this year";

  const options = {
    cutout: "80%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 20 },
      },
    },
  };

  return (
    <Card className="d-flex shadow justify-content-center">
      <Card.Header
        className="d-flex py-2 m-0 flex-row justify-content-between align-items-center"
        as="h5"
        style={{ color: "#4e73df" }}
      >
        Admission Source
      </Card.Header>

      <Card.Body style={{ height: "350px" }}>
  {total === 0 ? (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 6,
        color: "#6c757d",
        fontWeight: 600,
      }}
    >
      <div className="fs-3">No data for {periodLabel}
      </div>
    </div>
  ) : (
    <Doughnut data={data} options={options} />
  )}
</Card.Body>

    </Card>
  );
}

export default DonutCard;
