import React from "react"

const ConcertVenueTile = ({ id, name, location, capacity }) => {
  return (
    <div className="callout">
      <h4>{name}</h4>
      <p>{location}</p>
      <p>{capacity}</p>
    </div>
  )
}

export default ConcertVenueTile
