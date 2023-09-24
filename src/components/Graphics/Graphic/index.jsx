import React, { useEffect, useState } from 'react';
import Chart from 'react-google-charts'
import styles from './styles.module.scss'


const convertDataToChartFormat = (data) => {
  const chartData = data.map(([dateString, value]) => {
    const date = new Date(dateString);
    return [date, parseFloat(value)];
  });
  return [['Data', 'Valor'], ...chartData];
};

const colors = ['#2081c2', '#c02849', '#0fb469', '#c934eb']

export default function Graphic({ chartType, data, size, title, index }) {

  const [chartData, setChartData] = useState({})

  useEffect(() => {
    var tempChartData = []

    data.cambium.map((data, index) => {
      tempChartData[index] = [data.date, data.sellingPrice]
    })

    // tempChartData.unshift(['Data', 'Valor'])
    tempChartData = convertDataToChartFormat(tempChartData)

    setChartData(tempChartData)
  
    console.log('chartData', tempChartData);

  }, [])

  const options = {
    title: `${title.output} → ${title.input}`,
    subtitle: 'teste',
    titleTextStyle: {
      fontSize: 12,
      color: '#fff',
    },
    // legend: 'none',
    colors: [colors[index]],
    backgroundColor: {
      fill: '#173348',
      // fillOpacity: 1
    },
    titlePosition: 'none',
    chartArea:{height:'25%', width: '85%'},
    hAxis: {
      // title: 'Data',
      format: 'dd/MM',
      gridlines: {
        color: 'none',
        minSpacing: 0
      }
    },
    vAxis: {

    },
    gradient: {
      color1: '#fbf6a7',
      color2: '#33b679',
      x: '0%', y1: '0%',
      x2: '100%', y2: '100%',
      useObjectBoundingBoxUnits: true
    },
    // axes: {
    //   x: {
    //     0: 0
    //   }
    // },
    vAxis: {
      // title: 'Preço',
      // titleTextStyle: {
      //   color:'red'
      // },
      gridlines: {
        minSpacing: 0.05,
        count: 0,
      },
      format: 'currency'
    },
  }

  // const chartData = convertDataToChartFormat(data);

  const chartStyles = {
    background: 'linear-gradient(to bottom, #eb0303, #f0f7ff)', // Define your gradient colors
    borderRadius: '10px', // Optional: Add border radius for the chart area
    padding: '20px', // Optional: Add padding to the chart area
  };


  return (
    <div className={styles.chart}>
      <Chart
        width={size.width}
        height={size.height}
        chartType='LineChart'
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={options}
      />
    </div>
  )
}