import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/home.module.scss'
import CoinSelector from '@/components/coinSelector'
import CoinInput from '@/components/coinInput'
import ArticleCard from '@/components/articleCard'
import { api } from '@/services/priceApi'
import { useEffect, useState } from 'react'
import Graphic from '@/components/Graphics/Graphic'
import articles from '../assets/staticData'

const inter = Inter({ subsets: ['latin'] })

function useLoadGraphicsData() {
  const [graphicData, setGraphicData] = useState([]);

  useEffect(() => {
    async function loadGraphicsData() {
      const currencyArray = ["EUR-BRL", "BTC-EUR", "EUR-AOA", "USD-EUR"];
      var responseObjects = [];

      try {
        await Promise.all(
          currencyArray.map(async (code) => {
            const response = await api(`json/daily/${code}/10`, 'GET');
            responseObjects.push(response);
          })
        );

        // Função interna assíncrona para processar os dados
        async function processData() {
          const tempDataArray = []; // Array temporário para armazenar os dados de cada moeda

          responseObjects.forEach((cambiumData) => {
            const newGraphicData = {};

            cambiumData.forEach((object, index) => {
              if (index === 0) {
                // Define inputCambium e outputCambium se for o primeiro elemento.
                newGraphicData.inputCambium = object.code;
                newGraphicData.outputCambium = object.codein;
                return;
              }

              // Crie o objeto correspondente ao índice atual (1, 2, ...)
              newGraphicData[index] = {
                date: new Date(object.timestamp * 1000),
                sellingPrice: object.ask,
              };
            });


            // Adicione o objeto newGraphicData ao array temporário
            tempDataArray.push(newGraphicData);
          });

          return tempDataArray;
        }

        // Processar os dados dentro da função interna
        const tempData = await processData();

        // Mesclar os dados do tempData com o estado graphicData
        setGraphicData(tempData);

      } catch (error) {
        console.log('error', error);
      }
    }
    loadGraphicsData();
  }, []);

  return graphicData;
}

function useLoadAvailableConversions() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    /**
     * A função loadAvailableConvertions() carrega todas as moedas que a API suporta converter para o euro
     */
    async function loadAvailableConvertions() {
      try {
        const response = await api('json/available', 'GET')

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
    loadAvailableConvertions();
  }, []);

  return coins;
}

export default function Home() {

  const [selectedCoin, setSelectedCoin] = useState('BRL')

  const [conversorInputOne, setConversorInputOne] = useState(0);
  const [conversorInputTwo, setConversorInputTwo] = useState(1);

  const [eurAsk, setEurAsk] = useState(0)

  // Fetch and memoize graphic data
  const graphicData = useLoadGraphicsData();
  // Fetch and memoize available conversions
  const coins = useLoadAvailableConversions();

  const data = [
    ['Ano', 'Vendas'],
    [2015, 1000],
    [2016, 1170],
    [2017, 660],
    [2018, 1030],
  ];

  /**
   * A função tem a responsabilidade de setar o valor do input e calcular o outro input respectivamente
   * 
   * @param {Object} data - Um objeto contendo as propriedades event e type
   */
  function setAndConvertInputValues(data) {
    const newValue = data.event.target.value

    if (data.type) {
      setConversorInputOne(parseFloat(newValue * eurAsk).toFixed(2))
    } else {
      setConversorInputTwo(parseFloat(newValue / eurAsk).toFixed(2))
    }
  }

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

  useEffect(() => {
    console.log('graphicData', graphicData);
  }, [graphicData])


  return (
    <>
      <div className={styles.body}>

        <header className={styles.header}>
          <h1>Euro Moeda</h1>

          <div className={styles.blackBox}>
            <button>Outros conversores</button>
          </div>
        </header>

        <main className={styles.mainContainer}>

          <div className={styles.conversor}>



            <CoinInput
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
            />

          </div>

          <h1>Teste</h1>

        </main>

        <div className={styles.chartsSection}>

          <h2>Trocas populares</h2>
          <p>Aqui você encontra um gráfico dos últimos 30 dias das trocas mais populares</p>
          <p>Clique em um para obter mais detalhes</p>

          <div className={styles.chartsRow}>

            {graphicData.map((graphicEntry, index) => {

              const input = graphicEntry.inputCambium
              const output = graphicEntry.outputCambium

              const entryKeys = Object.keys(graphicEntry)

              var filteredData = entryKeys.map((key, index) => {
                if (!isNaN(parseInt(key))) {
                  return [
                    graphicEntry[key].date,
                    parseFloat(graphicEntry[key].sellingPrice).toFixed(2)
                  ]
                }
              })

              filteredData = filteredData.filter(element => element !== undefined);
              filteredData.unshift(['Data', 'Valor'])

              console.log('filteredData', filteredData);

              var options = {
                selectionMode: 'multiple',
                tooltop: { trigger: 'selection' },
                aggregationTarget: 'category'
              }



              return (
                <Graphic
                  key={index}
                  data={filteredData}
                  size={{ width: "200px", height: "150px" }}
                  chartType='Line'
                  title={{input: input, output: output}}
                />
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