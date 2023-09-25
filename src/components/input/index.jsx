import styles from './styles.module.scss'

export default function Input({coinValue, setCoinValue, currency, setCurrency, isCurrencyDefault, currencyList}) {

    return (
        <div className={styles.container}>

                <div className={styles.inputContainer}>
                  <p>Insira uma quantia:</p>

                  <input
                    type="number"
                    value={coinValue}
                    onChange={(e) => setCoinValue(e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                </div>

                {/* <CoinSelector
                  coinsList={coins}
                  defaultCoin={defaultCoin}
                  onChange={handleChanges}
                /> */}

                <div className={styles.coinSelector}>
                  <p>{currency}</p>

                  <select
                    disabled={isCurrencyDefault}
                    name="currency"
                    id="currency"
                    autoFocus
                    onChange={(e) => {console.log('herro'); setCurrency(e.target.value)}}
                    className={styles.selector}
                  >
                    {isCurrencyDefault ?
                      <option value={currency.name}>{currency.moeda}</option>
                      :
                      currencyList.map((coin, index) => {
                        return (
                          <option key={index} value={coin.moeda}>{coin.moeda}</option>
                        )
                      })
                    }
                  </select>
                </div>


              </div>
    )
}