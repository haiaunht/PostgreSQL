import React, { useState, useEffect } from 'react'

import QuoteItem from "./QuoteItem"

const QuotesList = (props) => {
  const [quotes, setQuotes] = useState([])

  const getQuotes = async () => {
    try {
      const response = await fetch("/api/v1/quotes")
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const responseBody = await response.json()
      setQuotes(responseBody.quotes)
    } catch(err) {
      console.error(`Error in Fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getQuotes()
  }, [])

  const quoteItems = quotes.map((quote) => {
    return (
      <QuoteItem
        key={quote.id}
        id={quote.id}
        quote={quote.quote}
        author={quote.author}
      />
    )
  })

  return (
    <div>
      <h1>My Quote List</h1>
      <ul className="quotes">
        {quoteItems}
      </ul>
    </div>
  )
}

export default QuotesList
