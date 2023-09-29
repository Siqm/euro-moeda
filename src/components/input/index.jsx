import CoinSelector from '../coinSelector'
import styles from './styles.module.scss'

export default function Input({ coinValue, setCoinValue, currency, setCurrency, isCurrencyDefault, currencyList }) {

  const defaultCoin = { moeda: "EUR", name: "Euro" }

  return (
    <div className={styles.container}>

      <div className={styles.inputContainer}>
        <p>Insira uma quantia:</p>

        <input
          inputMode='none'
          type="number"
          value={coinValue}
          onChange={(e) => setCoinValue(e.target.value, currency === "EUR" ? "output" : "input")}
          onFocus={(e) => e.target.select()}
        />
      </div>

      <CoinSelector coinsList={currencyList} defaultCoin={isCurrencyDefault ? defaultCoin : false} onChange={setCurrency} />
    </div>
  )
}