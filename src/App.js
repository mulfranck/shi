import { useState, useEffect } from "react";
import loader from './assets/loader-1.svg';
import $ from 'jquery';
import Chart from "./components/LineChart";
import ArcChart from './components/ArcChart';

import './App.css'
import BarChart from "./components/BarChart";
import Loader from "./components/loader";

const urls = [
    'https://wakatime.com/share/@Akashiutchiha/b3766d88-cd7e-48d2-9df8-dda0e72c2045.json',
    'https://wakatime.com/share/@Flyntdenzel/9f2d1aaa-233d-4afa-894b-207dd635668d.json',
    'https://wakatime.com/share/@mulfranck/4fdf6505-2b4c-4f67-bdfa-649580aec397.json',
    'https://wakatime.com/share/@prodfc/afa172e3-e16b-4568-8840-8f728988c6be.json'
]
const colors = ['red', 'blue', 'purple', 'coral'];

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
    const [ isLineShowing, setIsLineShowing ] = useState(true);
    // const [ userVsTime, setUserVsTime ] = useState({});
    // const [ sortLoser, setSortLosers ] = useState();
    const [ isloading, setIsLoading ] = useState(true);
    // const [ isTotalLoading, setIsTotalLoading ] = useState(true);

    const chartSwitchHandler = () => {
        setIsLineShowing(!isLineShowing);
    }

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

    /**
     * @param {Array} arrOfDays - Array of days from the api, in the give structure
     * @returns Array of time in mins in the format [50, 350, 0, ...]
     */
    const extractTime = (arrOfDays) => {
        return arrOfDays.map(day => {
            return Math.round(day.grand_total.total_seconds / 60); // seconds / 60 = mins
        })
    }
    
    useEffect(() => {
        let storedDataset = JSON.parse(sessionStorage.getItem('wk-amphi-dataset'));
        let storedLabels = JSON.parse(sessionStorage.getItem('wk-amphi-labels'));
        
        // console.log(!storedDataset && !storedLabels)

        // if data is not stored and the length of the datasets is also zero
        // then fetch
        if (!storedDataset && !storedLabels && datasets.length === 0){
            // console.log('fetching');
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
                        setDatasets(hold);
                        setIsLoading(false);
                        setLabels(label);
                    }
                    if (hold.length === 4) {
                        setIsLoading(false);
                        sessionStorage.setItem('wk-amphi-labels', JSON.stringify(label));
                        sessionStorage.setItem('wk-amphi-dataset', JSON.stringify(hold));
                        setDatasets(hold);
                        setLabels(label);
                    }

                    
                            
                });
            }
        } else {
            // if the storage is set and the datasets is zero the load the dataset
            if (datasets.length === 0) {
                console.log('stored data');
                setLabels(storedLabels);
                setDatasets(storedDataset);
                setIsLoading(false);
            }
        } // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     // Only if the datasets is setup
    //     console.log('What?', datasets)
    //     if (datasets) {
    //         let u = {};
    //         let finishedStruct = [];
    //         let usersTimes = [];

    //         for (let user of datasets) {
    //             let tt = user.data.reduce((p, c) => p + c, 0);
    //             u[tt] = user.label;

    //             usersTimes.push(tt);
    //         }

    //         usersTimes.sort((a, b) => a < b) // in decreasing the total time


    //         console.log(usersTimes, u)
    //         for (let t of usersTimes) {
    //             let tt = t.toString();
    //             console.log(tt)
    //             finishedStruct.push();
    //         }

    //         console.log(finishedStruct)

    //     }
    // }, [datasets])

    return (
        <div className="app">
            <header className="header">
                <h2>Amphi Shi Challenge</h2>
            </header>
            <main>
            <aside>
                <div>
                    <h3>Charts </h3>
                    <button className={isLineShowing ? 'Active': ''} onClick={chartSwitchHandler}>{ isLineShowing ? 'Line Chart' : 'Bar Chart' }</button>
                </div>

                <div>
                    <h3> Users </h3>
                    {urls.map((u, i) => <button key={i}>{u.split('/')[4]}</button>)}
                </div>

            </aside>
            <section className="left--main">
                <div className="top-row">
                    {isloading && <Loader loader={loader} />} 
                    { datasets && datasets.map((user, idx) => {
                        return <ArcChart key={idx} datasets = {user} />
                    })}
                </div>

                <div className="main-chart">
                    {isloading && <Loader loader={loader} />} 
                    {datasets && isLineShowing && <Chart labels={labels} datasets={datasets} chartType='line'/>}
                    {datasets && !isLineShowing && <BarChart labels={labels} datasets={datasets} />}
                </div>

            </section>

            <section className="right-noti">
                <h3>Total Time : </h3>
                {
                    datasets && datasets.map((user, idx) => {
                        return <div key={idx} className="user-time">
                            <span className="total-time">{user.data.reduce((pre, cur) => pre+cur, 0)}</span> <span>{user.label} </span>
                        </div>
                    })
                }
            </section>
            </main>
        </div>
    )
}

export default App;