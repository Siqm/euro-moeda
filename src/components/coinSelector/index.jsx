import React, { useEffect, useState } from "react";
import styles from './styles.module.scss'

export default function CoinSelector({ coinsList, defaultCoin, onChange }) {

    function handleChanges(event) {

        setCoinSelected(event.target.value)
        onChange(event)
    }

    const selection = !!defaultCoin ? true : false

    const [coinSelected, setCoinSelected] = useState('')

    useEffect(() => {
        selection ? setCoinSelected('Euro') : setCoinSelected('Selecione:') 
    }, [])

    return (
        <div className={styles.coinSelector}>
            <p>{coinSelected}</p>

            <select
                disabled={selection}
                name="currency"
                id="currency"
                autoFocus
                onChange={handleChanges}
                className={styles.selector}
            >
                {selection ? 
                    <option value={defaultCoin.name}>{defaultCoin.moeda}</option> 
                    :
                    coinsList.map((coin, index) => {
                        return (
                            <option key={index} value={coin.name}>{coin.moeda}</option>
                        )
                    }) 
                }
            </select>
        </div>
    )
}