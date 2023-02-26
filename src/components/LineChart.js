import {
  Chart as ChartJs,
  LineElement,
  Title,
  Legend,
  Tooltip,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

import { Line } from "react-chartjs-2";

// instantiate a chart
ChartJs.register(
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ datasets, labels }) => {

    const lineOpt = {
        responsive: true,
        transition: {
            show: {
                animations: {
                    x: { from: 0 },
                    y: { from: 0 },
                    
                }
            },
            hide: {
                animations: {
                    x: { to: 0 },
                    y: { to: 0 },
                }
            }
        },
        plugin: {
            legend: {
                display: false,
            },

            title: {
                display: true,
                text: 'One week Chart'
            }
        }
    }
    const lineData = {
        labels,
        datasets
    }

    return (

        <article className="chart col-6">
            <Line option={lineOpt} data={lineData} />
        </article>
    )
};

export default Chart;
