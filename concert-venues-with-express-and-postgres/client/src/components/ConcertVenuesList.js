import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import ConcertVenueTile from "./ConcertVenueTile"

const ConcertVenuesList = () => {
  const [concertVenues, setConcertVenues] = useState([])

  const getConcertVenues = async () => {
    try {
      const response = await fetch("/api/v1/concert-venues")
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw error
      }
      const body = await response.json()
      setConcertVenues(body.concertVenues)
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getConcertVenues()
  }, [])

  const concertVenueTiles = concertVenues.map(concertVenueObject => {
    const { id, name, location, capacity } = concertVenueObject
    return <ConcertVenueTile key={id} name={name} location={location} capacity={capacity} />
  })

  return (
    <div className="callout">
      <h1>My Favorite Concert Venues</h1>
      {concertVenueTiles}
      <Link to="/concert-venues/new">
        <h3>Add New Concert Venue</h3>
      </Link>
    </div>
  )
}

export default ConcertVenuesList
