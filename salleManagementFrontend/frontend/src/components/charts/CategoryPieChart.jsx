import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart() {
  const data = {
    labels: ["Electronics", "Books", "Clothing", "Home"],
    datasets: [
      {
        label: "Categories",
        data: [40, 25, 20, 15],
        backgroundColor: [
          "#2563eb",
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "60%",
  };

  return <Doughnut data={data} options={options} />;
}
