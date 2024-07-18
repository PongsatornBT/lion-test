import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

function Storage() {
  const [products, setProducts] = useState([]);
  const [selectedSemiBatch, setSelectedSemiBatch] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [label, setLabel] = useState([])
  const [dataSet, setDataSet] = useState([])
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

  // Aggregate Act_Weight by SemiBatch
  const aggregatedData = products.reduce((acc, product) => {
    // console.log(product);
    const { SemiBatch, Act_Weight, DateTime } = product;
    if (!acc[SemiBatch]) {
      acc[SemiBatch] = [];
    }
    acc[SemiBatch].push({ Act_Weight, DateTime });
    return acc;
  }, {});

  // Prepare data for chart
  // console.log(Object.keys(aggregatedData));
  let chartData = {
    labels: Object.keys(aggregatedData), // SemiBatch numbers as labels
    datasets: [
      {
        label: "Act_Weight",
        data: Object.values(aggregatedData).map((data) => data.reduce((total, { Act_Weight }) => total + Act_Weight, 0)),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
  

  const chartOptions = {
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const clickedSemiBatch = chartData.labels[elements[0].index];
        setSelectedSemiBatch(clickedSemiBatch);
        setSelectedData(aggregatedData[clickedSemiBatch]);
        setLabel(selectedData.map(entry => entry.DateTime));
        setDataSet(selectedData.map(entry => entry.Act_Weight))
      } else {
        setSelectedSemiBatch(null);
        setSelectedData([]);
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Act_Weight: ${tooltipItem.raw}`,
        },
      },
    },
  };

  return (
    <div>
      <h1>Factory Dashboard</h1>
      <Bar data={chartData} options={chartOptions} />
      {selectedSemiBatch && (
        <div>
          <h2>Details for SemiBatch {selectedSemiBatch}</h2>
          <ul>
            {selectedData.map(({ Act_Weight, DateTime }, index) => (
              <li key={index}>
                DateTime: {DateTime}, Act_Weight: {Act_Weight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Storage;