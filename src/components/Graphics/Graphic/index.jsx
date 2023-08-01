import React from 'react';
import Chart from 'react-google-charts'
import styles from './styles.module.scss'

const convertDataToChartFormat = (data) => {
  const chartData = data.map(([dateString, value]) => {
    const date = new Date(dateString);
    return [date, parseFloat(value)];
  });
  return [['Data', 'Valor'], ...chartData];
};


export default function Graphic({ chartType, data, size, title }) {

  const options = {
    title: `${title.input} -> ${title.output}`,
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
    hAxis: {
      title: 'Data',
      format: 'dd/MM',
      gridlines: {
        color: 'none',
        minSpacing: 0
      }
    },
    vAxis: {
      gridlines: {
        title: 'Preço',
        color: 'none',
        minSpacing: 0
      }
    }
  }

  const chartData = convertDataToChartFormat(data);

  return (
    <>
      <Chart
        chartType='LineChart'
        data={chartData}
        width={size.width}
        height={size.height}
        options={options}
      />
    </>
  )
}