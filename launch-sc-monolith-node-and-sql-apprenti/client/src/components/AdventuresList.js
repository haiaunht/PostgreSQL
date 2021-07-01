import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdventureTile from './AdventureTile'

const AdventuresList = props => {
  const [adventures, setAdventures] = useState([])

  const getAdventures = async () => {
    try {
      const response = await fetch("/api/v1/adventures")
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const adventureData = await response.json()
      setAdventures(adventureData.adventures)
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getAdventures()
  }, [])

  const adventureListItems = adventures.map(adventure => {
    return(
      <AdventureTile
        key={adventure.id}
        id={adventure.id}
        title={adventure.title}
        location={adventure.location}
      />
    )
  })

  return(
    <>
      <h1>My Adventures</h1>
      <ul className="adventures">
        {adventureListItems}
      </ul>
      <h3 className="text-center"><Link to="/adventures/new">Dream Up a New Adventure!</Link></h3>
    </>
  )
}

export default AdventuresList
