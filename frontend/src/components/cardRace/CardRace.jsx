import React from 'react'
import './CardRace.css'

const CardRace = ({dataRace}) => {

  return (
    <div className='cardRace'>
        <h2>{dataRace.nome}</h2>
        <p>{new Date(dataRace.data).toLocaleDateString("pt-BR")}</p>
        <a href={`https://www.google.com/maps?q=${dataRace.latitude},${dataRace.longitude}`} target="_blank" rel="noreferrer">{dataRace.circuito}</a>
    </div>
  )
}

export default CardRace