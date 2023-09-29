import React, { useEffect, useState } from "react";
import styles from './styles.module.scss'

/**
 * Componente que representa um seletor de moedas.
 * 
 * @param {Object} param0 - Um objeto contendo os seguintes atributos:
 * @param {Array} param0.coinsList - Uma matriz de objetos representando as opções de moedas disponíveis para seleção.
 * Cada objeto deve ter as seguintes propriedades:
 * @param {string} param0.coinsList.name - O nome da moeda.
 * @param {string} param0.coinsList.moeda - O símbolo ou código da moeda.
 * @param {number} param0.coinsList.index - O índice da moeda na matriz coinsList.
 * @param {string} param0.defaultCoin - A moeda padrão selecionada inicialmente no seletor. Deve ser o símbolo ou código da moeda.
 * @param {function} param0.onChange - Uma função de retorno de chamada (callback) a ser invocada quando a moeda selecionada mudar.
 * A função de callback será chamada com o símbolo ou código da moeda selecionada como seu único argumento.
 * @returns {JSX.Element} - O componente React que renderiza o seletor de moedas.
 */
export default function CoinSelector({ coinsList, defaultCoin, onChange }) {
    // Corpo da função (lógica do componente) vai aqui.
    // O componente renderiza o seletor de moedas com base nos parâmetros fornecidos.

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
                onChange={(e) => onChange(e.target.value)}
                className={styles.selector}
            >
                {selection ? 
                    <option value={defaultCoin.name}>{defaultCoin.moeda}</option> 
                    :
                    coinsList.map((coin, index) => {
                        return (
                            <option key={index} value={coin.moeda}>{coin.moeda}</option>
                        )
                    }) 
                }
            </select>
        </div>
    )
}