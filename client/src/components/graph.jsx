import {
  Chart as ChartJS,
  LineElement, // Changed from BarElement
  CategoryScale,
  LinearScale,
  PointElement, // Added - needed for Line charts
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement, // Changed from BarElement
  CategoryScale,
  LinearScale,
  PointElement, // Added
  Tooltip,
  Legend,
);

export default function CommitChart({ commitData }) {
  const now = new Date();
  const labels = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleString("default", { month: "short" }));
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Commits per Month",
        data: commitData.slice(-6),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderRadius: 6,
        borderColor: "#3b82f6",
        borderWidth: 2,
        fill: false,
        tension: 0.4, // smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { borderJoinStyle: "round" } },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "rgb(107, 114, 128)",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: "rgba(156, 163, 175, 0.2)", // Light gray grid
        },
        ticks: {
          color: "rgb(107, 114, 128)", // Gray that works on light/dark
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.2)", // Light gray grid
        },
        ticks: {
          color: "rgb(107, 114, 128)",
        },
      },
    },
  };

  return (
    <div className="h-96 w-full max-w-4xl">
      <Line data={data} options={options} />
    </div>
  );
}
