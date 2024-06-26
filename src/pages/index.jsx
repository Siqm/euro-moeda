import { Inter } from 'next/font/google'
import styles from '@/styles/home.module.scss'
import ArticleCard from '@/components/articleCard'
import { api } from '@/services/priceApi'
import { useEffect, useState } from 'react'
import articles from '../assets/staticData'
import Input from '@/components/input'
import GraphicFix from '@/components/Graphics/Graphic'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [currency, setCurrency] = useState("BRL")
  const [inputCoin, setInputCoin] = useState(0);
  const [outputCoin, setOutputCoin] = useState(1.00);
  const [coins, setCoins] = useState([])
  const [eurAsk, setEurAsk] = useState(5.2)
  const [isFirstRender, setIsFirstRender] = useState(false)
  const [graphicData, setGraphicData] = useState()
  const [loading, setLoading] = useState(true)
  const [trendCurrencies, setTrendCurrencies] = useState([])

  /**
   * syncCoinValues()
   * Converte os valores inseridos de acordo com a Ask atual
   * @param {number} newValue Novo valor inserido pelo usuario
   * @param {string} inputType 
   */
  function syncCoinValues(newValue, inputType) {
    if (inputType === "input") {
      setInputCoin(newValue)
      setOutputCoin(parseFloat(newValue / eurAsk).toFixed(2))
    } else {
      setOutputCoin(newValue)
      setInputCoin(parseFloat(newValue * eurAsk).toFixed(2))
    }
  }

  function syncOnCurrencyChange(newValue, inputType) {
    console.log('on change sync');
    if (inputType === "input") {
      setInputCoin(parseFloat(newValue).toFixed(2))
      setOutputCoin(parseFloat( 1.000 ).toFixed(3).slice(0, -1))
    } else {

    }
  }

  async function loadAvailableConvertions() {

    var response
    try {
      response = await api('json/available', 'GET')

      var responseString = JSON.stringify(response)
      const responseLength = responseString.length - 1
      responseString = responseString.substring(1, responseLength)

      const regex = /"([A-Z]{3})-EUR":"([^"]+)\/Euro"/g;

      let result;
      const filteredData = [];

      while ((result = regex.exec(responseString)) !== null) {
        const moeda = result[1]; // Captura as 3 letras da moeda
        const name = result[2]; // Captura o nome completo da moeda

        filteredData.push({ moeda, name });
      }
      setCoins(filteredData)
    } catch (e) {
      console.log("error inside loadAvailableConvertions", e)
    }
  }

  function renderTrendCurrencies(currency, index) {
    const options = {
      USDEUR: 'US Dollar (USD)',
      JPYEUR: 'Japanese Yen (JPY)',
      GBPEUR: 'The Pound Sterling (GBP)',
    }

    const currencyKeys = Object.keys(currency)

    // console.log('chamou', currency.EURUSD ? currency.EURUSD.ask : undefined);

    return(
        <tr>
          <td>{options[currencyKeys[0]]}</td>
          <td>€ {Number(currency[currencyKeys[0]].ask).toFixed(2)}</td>
        </tr>
    )
  }

  useEffect(function loadAwesomeConvertions(){
    if (!isFirstRender) {
      loadAvailableConvertions()
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
          setLoading(false)

        } catch (error) {
          console.log('error', error);
        }
      }

      async function loadTrendingCurrencies() {
        const endpoints = ["USD-EUR", "JPY-EUR", "GBP-EUR"]
        var response = []
        await endpoints.map( async (v, k) => {
          response[k] = await api(`last/${v}`, 'GET')
        })
        setTrendCurrencies(response)
      }
      loadGraphicsData();
      loadTrendingCurrencies();
      setIsFirstRender(true)
    }
  }, [])

  /**
   * Observa qualquer alteração em selectedCoin e executa
   */
  useEffect(function convertEntry(){

    /**
     * Carrega o valor de conversão para a moeda escolhida
     */
    async function getEurAsk() {

      var awesomeApiEndpoint = `EUR-${currency}`

      try {
        var response = await api(`last/${awesomeApiEndpoint}`, 'GET')

        if (response.status === 404) {
          awesomeApiEndpoint = `${currency}-EUR`
          response = await api(`last/${awesomeApiEndpoint}`, 'GET')

          const dynamicProperty = Object.keys(response)[0];
          const responseObject = response[dynamicProperty]

          syncOnCurrencyChange(responseObject.ask, "output")
          if (response.status === 404) {
            throw new Error('Moeda não encontrada ' + awesomeApiEndpoint)
          }

        } else {

          const dynamicProperty = Object.keys(response)[0];
          const responseObject = response[dynamicProperty]
  
          setEurAsk(Number(responseObject.ask)) // Sets eurAsk
          syncOnCurrencyChange(responseObject.ask, "input")
        }
      } catch (error) {
        console.log(error)
      }
    }

    getEurAsk()
  }, [currency])

  return (
    <>
      <div className={styles.body}>


        <section className={styles.welcome}>

          <header className={styles.header}>
            <h2>Euro Moeda</h2>

            {/* <div className={styles.blackBox}>
            </div> */}
          </header>

          <main className={styles.mainContainer}>

            <div className={styles.conversor}>


              <Input
                coinValue={inputCoin}
                currency={currency}
                currencyList={coins}
                setCoinValue={syncCoinValues}
                isCurrencyDefault={false}
                setCurrency={setCurrency}
              />

              <Input
                coinValue={outputCoin}
                currency="EUR"
                currencyList={coins}
                setCoinValue={syncCoinValues}
                isCurrencyDefault={true}
              />

            </div>

            <h1 className={styles.mainTitle}>A simple and easy way to convert euros into other currencies.</h1>

          </main>
        </section>

        <section className={styles.chartsSection}>

          <div className={styles.chartsText}>
            <h2>Popular Exchanges</h2>
            <p>Here you'll find a chart of the most popular exchanges in the last 30 days</p>
            <p>Hover it get more details</p>
          </div>

          <div className={styles.chartsRow}>

            {
              !loading ? <GraphicFix graphicData={graphicData} /> : <h1>loading</h1>
            }

          </div>
        </section>

        <section className={styles.tradedCurrencies}>
          <h2>Most traded currencies price in Euro</h2>
            <table>
              <thead>
                <tr>
                  <td>Currency</td>
                  <td>Price (EUR)</td>
                </tr>
              </thead>
              <tbody>
                { trendCurrencies && trendCurrencies.map((v) => {
                  console.log('v', v);
                  return renderTrendCurrencies(v)
                })}
              </tbody>
            </table>
        </section>

        <section className={styles.articlesSection}>
          <ArticleCard articles={articles} />
        </section>

        <footer className={styles.footer}>
            <p className={styles.footerText}>Developed by Siq Enterprise</p>
        </footer>
      </div>
    </>
  )
}