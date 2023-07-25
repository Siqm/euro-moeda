import React from 'react';
import Chart from 'react-google-charts'
import styles from './styles.module.scss'

const options = {
  title: 'Spend Uplift',
  backgroundColor: {
    fill: '#173348',
    fillOpacity: 1
  },
  colors: ['#FB7A21'],
  axes: {
    x: {
      0: 0
    }
  },
  legend: 'none',
  hAxis: {gridlines: {color: 'none', minSpacing: 0}},
  vAxis: {gridlines: {color: 'none', minSpacing: 0}}
}


export default function Graphic({ chartType, data, size }) {

  return (
    <>
      <Chart
        chartType='LineChart'
        data={data}
        width={size.width}
        height={size.height}
        options={options}
      />
    </>
  )
}