import { 
    Chart,
    BarElement,
    Title,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";


Chart.register(
    BarElement,
    Title,
    Legend,
    Tooltip,
    LinearScale,
    CategoryScale
)


const BarChart = ({labels, datasets}) => {

    const barData = { labels, datasets}
    const barOpt = {
        responsive: true,
        transition: {
            show: {
                animations: {
                    x : { from : 0 },
                    y : { from : 0 }
                }
            },
            hide: {
                animations: {
                    x: { to: 0 },
                    y: { to: 0 }
                }
            }
        },

        plugin: {
            legend: {
                display: true
            }
        }
    }


    return (
        <article className="chart col-6">
            <Bar options={barOpt} data={barData} />

            <h3>A bar should be showing.</h3>
        </article>
    )
}

export default BarChart;