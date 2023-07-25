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

async function loadConvertionPrice (ApiParam0) {

  try {
    const response = await api(`json/last/${ApiParam0}`, 'GET')
    console.log('response', response);

  } catch (error) {
    console.log(error)
  }
}

export default function Home() {

  const [selectedCoin, setSelectedCoin] = useState('BRL')

  const [conversorInputOne, setConversorInputOne] = useState(0);
  const [conversorInputTwo, setConversorInputTwo] = useState(0);

  const [eurAsk, setEurAsk] = useState(0)
  const [selectedAsk, setSelectedAsk] = useState(0)

  const [ApiParam0, setApiParam0] = useState('')

  const [coins, setCoins] = useState([])
  const changes = ''

  const data = [
    ['Ano', 'Vendas'],
    [2015, 1000],
    [2016, 1170],
    [2017, 660],
    [2018, 1030],
  ];

  useEffect(() => {

    function loadConversorValues() {
      
      
    }
    
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

    setApiParam0(`${selectedCoin}-EUR`)

    loadConvertionPrice(ApiParam0)
    loadAvailableConvertions()
  }, [])

  useEffect(() => {

    async function getEurAsk() {

      const awesomeApiEndpoint = `EUR-${selectedCoin}`

      const response = await api(`/last/${awesomeApiEndpoint}`, 'GET')

      const dynamicProperty = Object.keys(response)[0];
      const responseObject = response[dynamicProperty]

      console.log('response', JSON.stringify(responseObject));

      setEurAsk(Number(responseObject.ask)) // Sets eurAsk
      setConversorInputOne(Number(Number(responseObject.ask).toFixed(2)))
    }
    
    getEurAsk()

    console.log('selectedCoin', selectedCoin);

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



            <CoinInput coins={coins} onChange={changes} readCoinSelection={(eventData) => setSelectedCoin(eventData)} coinValue={conversorInputOne}/>

            <CoinInput defaultCoin={{moeda: 'EUR', name: 'Euro'}} coins={coins} coinValue={conversorInputTwo} />

          </div>

          <h1>Teste</h1>

        </main>

        <div className={styles.chartsSection}>

          <h2>Trocas populares</h2>
          <p>Aqui você encontra um gráfico dos últimos 30 dias das trocas mais populares</p>
          <p>Clique em um para obter mais detalhes</p>
          <Graphic size={{width: "200px", height: "150px"}} chartType='Line' data = {data}/>

        </div>

        <div className={styles.articlesSection}>
          <ArticleCard articles={articles} />
        </div>
      </div>
    </>
  )
}
