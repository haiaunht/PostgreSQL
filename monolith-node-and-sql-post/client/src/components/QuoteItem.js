import React from "react"
import { Link } from "react-router-dom"

const QuoteItem = (props) => {
  return (
    <li><Link to={`/quotes/${props.id}`}>{props.quote} by {props.author}</Link></li>
  )
}

export default QuoteItem
