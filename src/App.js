import { useState, useEffect } from "react";
import $ from 'jquery';
import Chart from "./components/LineChart";
import ArcChart from './components/ArcChart';

import './App.css'

const urls = [
    'https://wakatime.com/share/@mulfranck/4fdf6505-2b4c-4f67-bdfa-649580aec397.json',
    'https://wakatime.com/share/@Akashiutchiha/b3766d88-cd7e-48d2-9df8-dda0e72c2045.json'
]
const colors = ['purple', 'red', 'blue'];

function fetchData(url) {
    return $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            // success: function(response) {
            //     return (response.data)
            // },
        });
}


let hold = [];


const App = () => {
    /**
     *  newData = [
     *      {
     *          username,
     *          days: []
     *          timerange
     *      },
     * ]
     * 
     * [
     *  {
     *    lebal: [],
     *    data [
     *       { 
     *          username:
     *          labels: timerange
     *          bordercolor:
     *          background:
     *        }
     *    ]
     *  }
     * ]
     */
    const [ datasets, setDatasets ] = useState([]); 
    const [ labels, setLabels ] = useState([]); // ['Mon', 'Tues', ..] i.e the x-axis values

    /**
     * @param {Array} arrOfDays - an array of object from the api
     * @returns Array of days in the format ['Mon 20th', 'Tue 21st' ... ]
     */
    const extractDay = (arrOfDays) => {
        return arrOfDays.map(day => {
            let daysSections = day.range.text.split(' ');
            return daysSections[0] + ' ' + daysSections[2]; // e.g Mon 20th
        })
    }

    const extractTime = (arrOfDays) => {
        return arrOfDays.map(day => {
            return Math.round(day.grand_total.total_seconds / 60); // seconds / 60 = mins
        })
    }
    
    useEffect(() => {
        let storedDataset = JSON.parse(sessionStorage.getItem('wk-amphi-dataset'));
        let storedLabels = JSON.parse(sessionStorage.getItem('wk-amphi-labels'));
        
        console.log(!storedDataset && !storedLabels)

        // if data is not stored and the length of the datasets is also zero
        // then fetch
        if (!storedDataset && !storedLabels && datasets.length === 0){
            console.log('fetching');
            for (let linkIdx in urls) {
                let name = urls[linkIdx].split('/')[4];
                
                fetchData(urls[linkIdx]).then((dt) => {
                    let fetchedData = dt.data;


                    let dataset = {
                            label: name,
                            data: extractTime(fetchedData),
                            borderColor: colors[linkIdx],
                            backgroundColor: colors[linkIdx],
                            cubicInterpolationMode: 'monotone',
                        }

                    // console.log(dataset)
                    hold[linkIdx] = dataset;

                    let label = extractDay(fetchedData);
                    
                    if (hold.length === 2) {
                        setDatasets(hold)
                        setLabels(label);
                        sessionStorage.setItem('wk-amphi-labels', JSON.stringify(label));
                        sessionStorage.setItem('wk-amphi-dataset', JSON.stringify(hold));
                    }
                            
                });
            }
        } else {
            // if the storage is set and the datasets is zero the load the dataset
            if (datasets.length === 0) {
                console.log('stored data');
                setLabels(storedLabels);
                setDatasets(storedDataset);
            }
        }
    }, []);

    return (
        <div className="app">
            <header className="header">
                <h2>Amphi Shi Challenge</h2>
            </header>
            <main>
            <aside>
                <div>
                    <h3>Charts </h3>
                    <button className="line-chart active">Line Chart</button>
                    <button className="bar-chart">Bar Chart</button>
                </div>

                <div>
                    <h3> Users </h3>
                    {datasets.map((u, i) => <button key={i}>{u.label}</button>)}
                </div>

            </aside>
            <section className="left--main">
                <div className="top-row">
                    { datasets && datasets.map((user, idx) => {
                        return <ArcChart key={idx} labels={user.label}  datasets = {user} />
                    })}
                </div>

                <div className="main-chart">
                    {datasets && <Chart labels={labels} datasets={datasets} chartType='line'/>}
                </div>

            </section>

            <section className="right-noti">
                <h3>Total Time : </h3>
                {
                    datasets && datasets.map((user) => {
                        console.log(user.data)
                        return <div className="user-time">
                            <span className="total-time">{user.data.reduce((pre, cur) => pre+cur, 0)}</span> {user.label}
                        </div>
                    })
                }
            </section>
            </main>
        </div>
    )
}

export default App;