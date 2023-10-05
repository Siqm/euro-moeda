import React from "react";
import styles from './styles.module.scss'
import Imagem from '../../../public/articles/article01-euromoeda.jpg'

/**
 * Articles é um array de objetos seguindo o modelo:
 * @param {*} articles [{title: string, imageUrl: string, imageAlt: string, text: string}]}
 * @returns 
 */
export default function ArticleCard({ articles }) {

  return (
    <>
      {articles.map((article, index) => {
        return (
          <div className={styles.align} key={index}>
            <div className={styles.cardContainer}>

              <img src={article.imageUrl} alt="" />

              <div className={styles.text}>
                <h2>
                  {article.title}
                </h2>

                {article.text.split('-').map((paragraph, i) => (
                  <p key={i + 10}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            <div className={styles.middleBackground}></div>
            <div className={styles.bottomBackground}></div>
          </div>
        )
      })}
    </>

  )
}