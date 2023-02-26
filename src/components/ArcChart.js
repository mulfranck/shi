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
    Legend
  );

const ArcChart = ({labels: name, datasets: dt}) => {

    const extractTT = (dt) => {
        return dt.data.reduce((p, c) => p + c, 0);
    }

    const tt = extractTT(dt);
    
    const arcData = {
        labels: [dt.label, 'almost 1000min'],
        datasets: [
            {
                label: 'Total time in minutes',
                data: [tt, 1000 - tt],
                borderColor: [dt.borderColor, 'floralwhite'],
                backgroundColor: [dt.backgroundColor, 'floralwhite'],
            },
        ]    
    }

    const lineOpt = {
        responsive: true,
        maintainAspectRatio: false,
        plugin: {
            title: {
                display: true,
                align: 'center',
                text: dt.label,
            }
        }
    }
    
    return (
        <div>
            <Doughnut options={lineOpt} id={dt.label} data={arcData}/>
        </div>
    )
}


export default ArcChart;