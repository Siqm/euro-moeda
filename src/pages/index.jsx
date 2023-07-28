import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/home.module.scss'
import CoinSelector from '@/components/coinSelector'
import CoinInput from '@/components/coinInput'
import ArticleCard from '@/components/articleCard'
import { api } from '@/services/priceApi'
import { useEffect, useState } from 'react'
import Graphic from '@/components/Graphic'

const inter = Inter({ subsets: ['latin'] })

const articles = [
  {
    title: 'Descubra A Euromoeda: Uma Ferramenta De Conversão De Moedas Para O Euro',
    imageUrl: '/articles/article01-euro-moeda.jpg',
    imageAlt: 'Monumento do simbolo do euro como moeda, com 12 estrelas',
    text: 'Você já se perguntou o que é o euro e porque ele é importante? Está procurando por uma maneira fácil de comprar ou converter euros para outra moeda? Se você já está familiarizado com a moeda européia ou está procurando começar a entender a partir do zero, então este artigo é para você.- Descubra tudo o que precisa saber sobre o euro incluindo o que é o Euromoeda.com com este artigo informativo. Aprenda sobre a história do euro, quais países usam a moeda européia, e qual é o futuro do euro. Obtenha todas essas informações e mais aqui no Euromoeda.com.',
  }, {
    title: 'Sobre o Euro',
    imageUrl: '/articles/article02-euro-moeda.jpg',
    imageAlt: 'Monumento do simbolo do euro como moeda, com 12 estrelas',
    text: 'O euro é a moeda oficial da Zona Euro, usada por 19 países da União Europeia para facilitar as transações comerciais. É regulado pela Autoridade Monetária Europeia e as notas e moedas são emitidas em diferentes denominações. A cotação do euro é influenciada por fatores como taxas de juros, estabilidade econômica, decisões políticas e exportações/importações.',
  }, {
    title: 'Como a Cotação do Euro Moeda é Influenciada?',
    imageUrl: '/articles/article04-euro-moeda.jpg',
    imageAlt: 'Um grupo de moedas de euro em uma superfície branca.',
    text: 'A cotação do euro moeda é influenciada principalmente pela oferta e demanda de moedas estrangeiras em relação ao euro. Fatores econômicos, políticos, bancários e rumores também podem afetar a cotação do euro. É importante compreender esses fatores para entender como eles podem influenciar o preço do euro.',
  }, {
    title: 'Como o Euro Pode Influenciar suas Viagens e Compras de Produtos Importados?',
    imageUrl: '/articles/article05-euro-moeda.jpg',
    imageAlt: 'Uma pilha de cedulas do euro.',
    text: 'O Euro Moeda é uma ferramenta útil para viagens e compras de produtos importados. Oferece segurança, rapidez e tarifas de câmbio competitivas. Ao converter moedas para o euro, você economiza tempo e pode fazer compras com tarifas mais baixas. A cotação do euro também pode ser influenciada pelas taxas de juros, então é importante acompanhar as taxas para obter as melhores tarifas de câmbio possíveis. O Euro Moeda oferece todas essas vantagens, permitindo que você viaje e compre com facilidade, economizando tempo e dinheiro.',
  }, {
    title: 'Diferença entre Euro Comercial e Euro Turismo',
    imageUrl: '/articles/article03-euro-moeda.jpg',
    imageAlt: 'Monumento do simbolo do euro como moeda, com 12 estrelas',
    text: 'No mercado cambial, o euro comercial é a moeda usada para transações comerciais, enquanto o euro turismo é usado para transações turísticas e compra de produtos importados. O euro comercial é a taxa oficial do euro, usada em compras internacionais. O euro turismo é usado para serviços turísticos e pode ter uma taxa um pouco mais alta.',
  },
]

export default function Home() {

  const [selectedCoin, setSelectedCoin] = useState('BRL')

  const [conversorInputOne, setConversorInputOne] = useState(0);
  const [conversorInputTwo, setConversorInputTwo] = useState(1);

  const [eurAsk, setEurAsk] = useState(0)

  const [coins, setCoins] = useState([])

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
   * Esse useEffect é executado no carregamento da página
   * 
   */
  useEffect(() => {

    /**
     * A função loadAvailableConvertions() carrega todas as moedas que a API suporta converter para o euro
     * 
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

    async function loadGraphicsData() {
      const currencyArray = ["BRL-EUR", "BTC-EUR", "EUR-AOA", "USD-EUR"]
      var responseObjects = []

      try {
        currencyArray.map(async (code) => {
          console.log('code', code);
          const response = await api(`json/daily/${code}/10`, 'GET')
  
          responseObjects.push(response)
        })
        console.log('responseObjects', responseObjects);
      } catch (error) {
        
      }
    }

    loadGraphicsData()
    loadAvailableConvertions()
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
        console.log('awesomeApiEndpoint', awesomeApiEndpoint);
      } catch (error) {
        console.log(error)
      }



    }

    getEurAsk()

  }, [selectedCoin])


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
          <Graphic
            data={data}
            chartType='Line'
            size={{ width: "200px", height: "150px" }}
          />

        </div>

        <div className={styles.articlesSection}>
          <ArticleCard articles={articles} />
        </div>
      </div>
    </>
  )
}
