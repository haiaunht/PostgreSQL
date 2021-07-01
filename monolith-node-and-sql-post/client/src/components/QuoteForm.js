import React, { useState } from "react"
import { Redirect } from "react-router-dom"

import ErrorList from "./ErrorList"

const QuoteForm = (props) => {
  const [quoteRecord, setQuoteRecord] = useState({
    quote: "",
    author: "",
    subject: "",
  })
  const [errors, setErrors] = useState([])
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const addNewQuote = async () => {
    try {
      const response = await fetch("/api/v1/quotes", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(quoteRecord)
      })
      if (!response.ok) {
        if(response.status === 422) {
          const body = await response.json()
          return setErrors(body.errors)
        } else {
          const errorMessage = `${response.status} (${response.statusText})`
          const error = new Error(errorMessage)
          throw(error)
        }
      } else {
        const body = await response.json()
        console.log("Posted successfully!", body);
        setShouldRedirect(true)
      }
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  const handleChange = (event) => {
    const targetInput = event.currentTarget
    let value

    if (targetInput.type === "checkbox") {
      value = targetInput.checked
    } else {
      value = targetInput.value
    }

    setQuoteRecord({
      ...quoteRecord,
      [event.currentTarget.name]: value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addNewQuote()
  }

  if (shouldRedirect) {
    return <Redirect to="/quotes" />
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add a New Quote</h1>
      <label htmlFor="quote">Quote
        <input
          id="quote"
          type="text"
          name="quote"
          onChange={handleChange}
          value={quoteRecord.quote}
        />
      </label>

      <label htmlFor="author">Author
        <input
          id="author"
          type="text"
          name="author"
          onChange={handleChange}
          value={quoteRecord.author}
        />
      </label>

      <label htmlFor="subject">Subject
        <input
          id="subject"
          type="text"
          name="subject"
          onChange={handleChange}
          value={quoteRecord.subject}
        />
      </label>

      <input type="submit" value="Add this Quote" />
    </form>
  )
}

export default QuoteForm
