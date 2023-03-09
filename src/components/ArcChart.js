import {
    Chart as ChartJs,
    Title,
    Legend,
    Tooltip,
    ArcElement,
  } from "chart.js";
  
  import {  Doughnut } from "react-chartjs-2";
  
  // instantiate a chart
  ChartJs.register(
    ArcElement,
    Tooltip,
    Title,
    Legend
  );

// Against 2100mins thats roughly 5hrs aday.

const ArcChart = ({datasets: dt}) => {

    const extractTT = (dt) => {
        return dt.data.reduce((p, c) => p + c, 0);
    }

    const tt = extractTT(dt);
    
    const arcData = {
        labels: [dt.label, 'Challenge target'],
        datasets: [
            {
                label: ['Total time in minutes'],
                data: [tt, 2100 - tt],
                borderColor: [dt.borderColor, 'powderblue'],
                backgroundColor: [dt.backgroundColor, 'powderblue'],
            },
        ]    
    }

    const lineOpt = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        plugins: {
            datalabels: false,
            legend: {
                display: false,
            }
        },    
    }
    
    return (
        <div>
            <Doughnut options={lineOpt} id={dt.label} data={arcData}/>
        </div>
    )
}


export default ArcChart;