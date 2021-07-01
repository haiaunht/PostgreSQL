import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const Adventureshow = (props) => {
  const [adventure, setAdventure] = useState({})

  const getAdventure = async () => {
    try {
      const adventureId = props.match.params.id
      const response = await fetch(`/api/v1/adventures/${adventureId}`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const responseBody = await response.json()
      setAdventure(responseBody.adventure)
    } catch(err) {
      console.error(`Error in Fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getAdventure()
  }, [])

  return (
    <>
      <h1>{adventure.title}</h1>
      <h2>{adventure.location}</h2>
      <h3><Link to="/adventures">Back to All Adventures!</Link></h3>
    </>
  )
}

export default Adventureshow
