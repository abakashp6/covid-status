import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem,) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};


export const Chart = ({ countryNm, caseType }) => {

  const classes = makeStyles({
    chart: {
      height: '300px',
      backgroundColor:'white',
    },
  })()

  const color = {
    'cases': "rgba(204, 16, 52, 0.5)",
    'recovered': "rgb(125, 215, 29)",
    'deaths': 'red'
  }

  const [data, setData] = useState([])
  const [countryName, setCountryName] = useState('')

  const buildChartData = (dat, caseType) => {
    let chartData = [];
    let lastDataPoint;
    if (countryNm === 'worldWide') {
      setCountryName('worldWide')
      for (let date in dat[caseType]) {
        if (lastDataPoint) {
          let newDataPoint = {
            x: date,
            y: dat[caseType][date] - lastDataPoint,
          };
          chartData.push(newDataPoint);
        }
        lastDataPoint = dat[caseType][date];
      }
    }
    else {
      setCountryName(dat.country)
      for (let date in dat?.timeline?.[caseType]) {
        if (lastDataPoint) {
          let newDataPoint = {
            x: date,
            y: dat.timeline[caseType][date] - lastDataPoint,
          };
          chartData.push(newDataPoint);
        }
        lastDataPoint = dat.timeline[caseType][date];
      }
    }
    return chartData;
  };

  useEffect(() => {
    let url = countryNm === 'worldWide' ?
      'https://disease.sh/v3/covid-19/historical/all?lastdays=30' :
      `https://disease.sh/v3/covid-19/historical/${countryNm}?lastdays=30`;

    const fetchChartData = async () => (
      await fetch(url).then(res => res.json())
        .then(dat => {
          let chartData = buildChartData(dat, caseType);
          setData(chartData);
        })
    )
    fetchChartData()

  }, [countryNm, caseType])
  return (
    <div className={classes.chart}>
        <h2>{caseType} of: {countryName}</h2>
        {data?.length > 0 && (
          <Line
            data={{
              datasets: [
                {
                  backgroundColor: color[caseType],
                  borderColor: "#CC1034",
                  data: data,
                },
              ],
            }}
            options={options}
          />
        )}
    </div>
  )
}