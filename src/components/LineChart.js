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
import { useEffect } from "react";

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
                easing: "easeInCubic",
                animations: {
                    x: { from: 0, },
                    y: { from: 0, },
                },
            },
            hide: {
                easing: "easeOutCubic",
                animations: {
                    x: { to: 0, },
                    y: { to: 0, },
                },
            },
        },
    }
    const lineData = {
        labels,
        datasets
    }

    console.log('datasets', datasets);

    useEffect((effect) => {
        console.log('effect', effect)
    }, [datasets.length]);

    return (

        <article className="chart col-6">
            <Line option={lineOpt} data={lineData} />
        </article>
    )
};

export default Chart;
