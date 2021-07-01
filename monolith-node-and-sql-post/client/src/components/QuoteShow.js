import React, { useState, useEffect } from "react"

const Quoteshow = (props) => {
  const [quote, setQuote] = useState({})

  const getQuote = async () => {
    try {
      const quoteId = props.match.params.id
      const response = await fetch(`/api/v1/quotes/${quoteId}`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const responseBody = await response.json()
      setQuote(responseBody.quote)
    } catch(err) {
      console.error(`Error in Fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getQuote()
  }, [])

  return (
    <>
      <h1>{quote.quote}</h1>
      <h2>{quote.author}</h2>
      <h3>{quote.subject}</h3>
    </>
  )
}

export default Quoteshow
