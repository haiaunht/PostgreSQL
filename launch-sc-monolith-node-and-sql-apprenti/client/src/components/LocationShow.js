import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const LocationShow = (props) => {
  
  const [location, setLocation] = useState({})
  const getlocation = async () => {
    try {      
      const response = await fetch(`/api/v1/locations/${props.location}`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const responseBody = await response.json()
      setLocation(responseBody.location)
    } catch(err) {
      console.error(`Error in Fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getlocation()
  }, [])

  return (
    <>
      <h2>{location.name}</h2>
      <h3><Link to="/locations">Back to All Location!</Link></h3>
    </>
  )
}

export default LocationShow
