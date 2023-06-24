import React, { useEffect } from "react";
import styles from './styles.module.scss'
import CoinSelector from "../coinSelector";

export default function CoinInput({ defaultCoin, coinValue, onChange, coins }) {

  function handleChanges(event) {

    if (event.nativeEvent.type === 'input') {
      console.log('hello')
    }

    if (event.nativeEvent.type === 'change') {
      
      onChange.handleCoinSelection(event.target.value)
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