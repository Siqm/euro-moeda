import { Inter } from 'next/font/google'
import styles from '@/styles/home.module.scss'
import ArticleCard from '@/components/articleCard'
import { api } from '@/services/priceApi'
import { useEffect, useState } from 'react'
import Graphic from '@/components/Graphics/Graphic'
import articles from '../assets/staticData'
import Input from '@/components/input'

const inter = Inter({ subsets: ['latin'] })

// function useLoadGraphicsData() {


//   useEffect(() => {

//   }, []);

//   return graphicData;
// }

// function useLoadAvailableConversions() {


//   useEffect(() => {
//     /**
//      * A função loadAvailableConvertions() carrega todas as moedas que a API suporta converter para o euro
//      */
//     async function loadAvailableConvertions() {
//       try {
//         const response = await api('json/available', 'GET')

//         var responseString = JSON.stringify(response)
//         const responseLength = responseString.length - 1
//         responseString = responseString.substring(1, responseLength)

//         const regex = /"([A-Z]{3})-EUR":"([^"]+)\/Euro"/g;

//         let result;
//         const filteredData = [];

//         while ((result = regex.exec(responseString)) !== null) {
//           const moeda = result[1]; // Captura as 3 letras da moeda
//           const name = result[2]; // Captura o nome completo da moeda

//           filteredData.push({ moeda, name });
//         }
//         setCoins(filteredData)

//       } catch (e) {
//         console.log("error inside loadAvailableConvertions", e)
//       }
//     }
//     loadAvailableConvertions();
//   }, []);

//   return coins;
// }

export default function Home() {

  const [selectedCoin, setSelectedCoin] = useState('BRL')

  const [conversorInputOne, setConversorInputOne] = useState(0);
  const [conversorInputTwo, setConversorInputTwo] = useState(1);

  const [simpleText, setSimpleText] = useState("text")

  const [eurAsk, setEurAsk] = useState(0)
  const [isFirstRender, setIsFirstRender] = useState(false)

  // Fetch and memoize graphic data
  const [graphicData, setGraphicData] = useState([]);
  // Fetch and memoize available conversions
  const [coins, setCoins] = useState([]);

  /**
   * The function is responsible for setting the input value and calculating the other input accordingly
   * 
   * @param {Object} data - An object containing the properties event and type
   */
  function setAndConvertInputValues(data) {
    const newValue = data.event.target.value

    if (data.type) {
      setConversorInputOne(parseFloat(newValue * eurAsk).toFixed(2))
    } else {
      setConversorInputTwo(parseFloat(newValue / eurAsk).toFixed(2))
    }
  }

  useEffect(() => {
    if (!isFirstRender) {
      async function loadGraphicsData() {
        // Lista de graficos
        const currencyArray = ["EUR-BRL", "BTC-EUR", "EUR-AOA", "USD-EUR"];
        var responseObjects = [];
  
        try {
          await Promise.all(
            currencyArray.map(async (code) => {
              const response = await api(`json/daily/${code}/30`, 'GET');
              responseObjects.push(response);
            })
          );
  
          // Variação Percentual = ((Valor Final - Valor Inicial) / Valor Inicial) * 100
  
          const tempDataArray = []
  
          responseObjects.forEach((cambiumData) => {
            const newGraphicData = {}
            newGraphicData.cambium = []
  
            cambiumData.forEach((data, index) => {
              if (index === 0) {
                newGraphicData.inputCambium = data.code;
                newGraphicData.outputCambium = data.codein;
                newGraphicData.variation = data.ask
              }
  
              if (cambiumData.length - 1 === index) {
                const initialValue = newGraphicData.variation
                newGraphicData.variation = ((data.ask - initialValue) / initialValue) * 100
              }
  
              newGraphicData.cambium[index] = {
                date: new Date(data.timestamp * 1000),
                sellingPrice: data.ask,
              }
            })
  
            tempDataArray.push(newGraphicData);
          })
  
  
          // Mesclar os dados do tempData com o estado graphicData
          setGraphicData(tempDataArray);
  
        } catch (error) {
          console.log('error', error);
        }
      }
      loadGraphicsData();
      setIsFirstRender(true)
    }
  }, [])

  /**
   * Observa qualquer alteração em selectedCoin e executa
   */
  useEffect(() => {

    /**
     * Carrega o valor de conversão para a moeda escolhida
     */
    async function getEurAsk() {

      var awesomeApiEndpoint = `EUR-${selectedCoin}`

      try {
        var response = await api(`last/${awesomeApiEndpoint}`, 'GET')

        if (response.status === 404) {
          awesomeApiEndpoint = `${selectedCoin}-EUR`
          response = await api(`last/${awesomeApiEndpoint}`, 'GET')
          if (response.status === 404) {
            throw new Error('Moeda não encontrada ' + awesomeApiEndpoint)
          }
        }

        const dynamicProperty = Object.keys(response)[0];
        const responseObject = response[dynamicProperty]

        setEurAsk(Number(responseObject.ask)) // Sets eurAsk
        setConversorInputOne(Number(Number(responseObject.ask).toFixed(2)))
      } catch (error) {
        console.log(error)
      }
    }

    getEurAsk()
  }, [selectedCoin])

  return (
    <>
      <div className={styles.body}>


        <div className={styles.welcome}>
          <header className={styles.header}>
            <h1>Euro Moeda</h1>

            <div className={styles.blackBox}>
              <button>Be our partner now</button>
            </div>
          </header>

          <main className={styles.mainContainer}>

            <div className={styles.conversor}>

              <Input
                coinValue={conversorInputOne}
                currency={selectedCoin}
                currencyList={coins}
                setCoinValue={setConversorInputOne}
                isCurrencyDefault={false}
                setCurrency={setSelectedCoin}
              />

              <Input
                coinValue={conversorInputOne}
                currency={selectedCoin}
                currencyList={coins}
                setCoinValue={setConversorInputOne}
                isCurrencyDefault={true}
                setCurrency={setSelectedCoin}
              />

              {/* <CoinInput
              coins={coins}
              coinValue={conversorInputOne}
              setCoinValue={setConversorInputOne}
              onChange={setAndConvertInputValues}
              readCoinSelection={(eventData) => setSelectedCoin(eventData)}
            />

            <CoinInput
              coins={coins}
              coinValue={conversorInputTwo}
              setCoinValue={setConversorInputTwo}
              onChange={setAndConvertInputValues}
              defaultCoin={{ moeda: 'EUR', name: 'Euro' }}
            /> */}

            </div>

            <h1>Send money with us</h1>

          </main>
        </div>

        <div className={styles.chartsSection}>

          <div className={styles.chartsText}>
            <h2>Popular Exchanges</h2>
            <p>Here you'll find a chart of the most popular exchanges in the last 30 days</p>
            <p>Click on one to get more details</p>
          </div>

          <div className={styles.chartsRow}>

            {graphicData.map((graphicEntry, index) => {

              const input = graphicEntry.inputCambium
              const output = graphicEntry.outputCambium

              var options = {
                selectionMode: 'multiple',
                tooltop: { trigger: 'selection' },
                aggregationTarget: 'category'
              }



              return (
                <div className={styles.graphic}>
                  <Graphic
                    key={index}
                    data={graphicEntry}
                    size={{ width: "210px", height: "150px" }}
                    chartType='Line'
                    title={{ input: input, output: output }}
                    index={index}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.articlesSection}>
          <ArticleCard articles={articles} />
        </div>
      </div>
    </>
  )
}