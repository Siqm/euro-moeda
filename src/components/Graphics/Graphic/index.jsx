import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import styles from './styles.module.scss'

export default function GraphicFix({ graphicData }) {

  const [parsedData, setParsedData] = useState({});
  const [cached, setCached] = useState(false)

  function convertDataToChartFormat(data) {
    var convertedData = data.cambium.map((dailyInfo) => {
      const sellingDate = new Date(dailyInfo.date)
      const price = dailyInfo.sellingPrice
      return [sellingDate, parseFloat(price)]
    })
    return [['Data', 'Valor'], ...convertedData];
  };

  useEffect(function cacheGraphicData() {
    if (!cached) {
      if (typeof graphicData === "object") {
        setParsedData(
          graphicData.map((graphicEntry, index) => {
            const input = graphicEntry.inputCambium
            const output = graphicEntry.outputCambium

            //     var options = {
            //       selectionMode: 'multiple',
            //       tooltop: { trigger: 'selection' },
            //       aggregationTarget: 'category'
            //     }

            const parsedEntry = convertDataToChartFormat(graphicEntry)

            return { index, data: parsedEntry, input, output }
          })
        )
        setCached(true)
      }
    }
  }, [])

  const colors = ['#2081c2', '#c02849', '#0fb469', '#c934eb']

  const options = (output, input, index) => {
    return {
      title: `${output} ➡ ${input}`,
      titleTextStyle: {
        fontSize: 12,
        color: '#fff',
      },
      backgroundColor: {
        fill: '#173348',
        // fillOpacity: 1
      },
      vAxis: {
        textStyle: {
          color: '#fff'
        },
        gridlines: {
          color: '#FBF8BE', // Cor branca com alpha de 0.3 (30% de transparência) para as linhas de grade
        },
      },
      hAxis: {
        // gridlines: {
        //     color: 'red'
        // }

      },
      colors: [colors[index]],
      gridLines: {
      }
    }
  }

  return (
    <>
      {!cached ? <h1>loading</h1> : parsedData.map((value, index) => {
        return (
          <div key={index} className={styles.chart}>

            <Chart
              className={styles.chartContainer}
              chartType='LineChart'
              loader={<div>Loading Chart</div>}
              data={value.data}
              options={options(value.output, value.input, value.index)}
            />
          </div>
        )
      })

      }
    </>
  )
}