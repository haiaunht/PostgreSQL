import React from "react"
import { Link } from "react-router-dom"

const LocationTile = (props) => {
  
  return (
    <li><Link to={`/locations/${props.location}`}>{props.name}</Link></li>
  )
}

export default LocationTile