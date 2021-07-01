import React from "react"
import { Link } from "react-router-dom"

const AdventureTile = (props) => {
  return (
    <li><Link to={`/adventures/${props.id}`}>{props.title} in {props.location}</Link></li>
  )
}

export default AdventureTile
