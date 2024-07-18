import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

function Tagname() {
  const [products, setProducts] = useState([]);
  const [selectedTagname, setSelectedTagname] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Act_Weight",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  });

  async function fetchData() {
    try {
      const res = await fetch("public/data.json");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const normalizedData = data.flat();
      setProducts(normalizedData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Aggregate Act_Weight by Tagname
  const aggregatedData = products.reduce((acc, product) => {
    const { Tagname, Act_Weight, DateTime } = product;
    if (!acc[Tagname]) {
      acc[Tagname] = [];
    }
    acc[Tagname].push({ Act_Weight, DateTime });
    return acc;
  }, {});

  // Initial chart data setup
  useEffect(() => {
    const initialChartData = {
      labels: Object.keys(aggregatedData),
      datasets: [
        {
          label: "Act_Weight",
          data: Object.values(aggregatedData).map((data) =>
            data.reduce((total, { Act_Weight }) => total + Act_Weight, 0)
          ),
          backgroundColor: "#74A8CB",
          borderColor: "#74A8CB",
          borderWidth: 1,
        },
      ],
    };

    setChartData(initialChartData);
  }, [products]);

  // Handle click on chart bars
  const handleClick = (_, elements) => {
    if (elements.length > 0) {
      const clickedTagname = chartData.labels[elements[0].index];
      setSelectedTagname(clickedTagname);
      const selectedDataForBatch = aggregatedData[clickedTagname];
      setSelectedData(selectedDataForBatch);

      const updatedChartData = {
        labels: selectedDataForBatch.map(({ DateTime }) => DateTime),
        datasets: [
          {
            label: "Act_Weight",
            data: selectedDataForBatch.map(({ Act_Weight }) => Act_Weight),
          },
        ],
      };

      setChartData(updatedChartData);
    } else {
      setSelectedTagname(null);
      setSelectedData([]);
      // Reset chart data if no bar is clicked
      setChartData({
        labels: Object.keys(aggregatedData),
        datasets: [
          {
            label: "Act_Weight",
            data: Object.values(aggregatedData).map((data) =>
              data.reduce((total, { Act_Weight }) => total + Act_Weight, 0)
            ),
          },
        ],
      });
    }
  };

  const chartOptions = {
    scales: {
      y: {
        title: {
          display: true,
          text: "Weight", // Y-axis label
        },
      },
    },
    onClick: handleClick,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Act_Weight: ${tooltipItem.raw}`,
        },
      },
    },
    responsive: true, // Enable responsiveness
  };

  return (
    <div>
      <h1>Weight group by Tagname Dashboard</h1>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default Tagname
