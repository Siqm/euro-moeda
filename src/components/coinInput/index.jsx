import React, { useEffect } from "react";
import styles from './styles.module.scss'
import CoinSelector from "../coinSelector";

export default function CoinInput({ defaultCoin, coinValue, setCoinValue, onChange, coins, readCoinSelection }) {

  function handleChanges(event) {

    if (event.nativeEvent.type === 'input') {
      setCoinValue(event.target.value)
      const data = {event: event, type: defaultCoin}
      onChange(data)
    }

    if (event.nativeEvent.type === 'change') {
      
      readCoinSelection(event.target.value)
    }
  }

  return (
    <div className={styles.container}>

      <div className={styles.inputContainer}>
        <p>Insira uma quantia:</p>

        <input
          type="number"
          value={coinValue}
          onChange={handleChanges}
          onFocus={(e) => e.target.select()}
        />
      </div>

      <CoinSelector
        coinsList={coins}
        defaultCoin={defaultCoin}
        onChange={handleChanges}
      />
    </div>
  )
}