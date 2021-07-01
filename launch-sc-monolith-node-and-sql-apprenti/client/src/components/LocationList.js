import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import LocationTile from './LocationTile'

const LocationList = props => {
  const [locations, setLocations] = useState([])

  const getLocations = async () => {
    try {
      const response = await fetch("/api/v1/locations")
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const locationData = await response.json()
      setLocations(locationData.locations)
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getLocations()
  }, [])

  const locationListItems = locations.map(locationPlace => {
    return(
      <LocationTile
        key={locationPlace.location}
        location={locationPlace.location}        
        name={locationPlace.name}
      />
    )
  })

  return(
    <>
      <h1>All Locations</h1>
      <ul className="adventures">
        {locationListItems}
      </ul>
    </>
  )
}

export default LocationList
