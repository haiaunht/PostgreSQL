import React, { useState } from "react"
import { Redirect } from "react-router-dom"
import ErrorList from "./ErrorList"

const NewConcertVenueForm = props => {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [errors, setErrors] = useState([])
  const [newVenue, setNewVenue] = useState({
    name: "",
    location: "",
    capacity: ""
  })

  const handleInputChange = event => {
    setNewVenue({
      ...newVenue,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }

  const validForSubmission = () => {
    let submitErrors = {}
    const requiredFields = ["name", "location", 'capacity']
    requiredFields.forEach(field => {
      if (newVenue[field].trim() === "") {
        submitErrors = {...submitErrors, [field]:"is blank"}
      }
    })

    setErrors(submitErrors)
    return _.isEmpty(submitErrors)
  }

  const postNewVenue = async () => {
    
    try {
      const response = await fetch("/api/v1/concert-venues", {
        method: "POST",
        credentials: "same-origin",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(newVenue)
      })
      if (!response.ok) {
        if(response.status === 422) {
          const body = await response.json()
          return setErrors(body.errors)
        } else {
          const errorMessage = `${response.status} (${response.statusText})`
          const error = new Error(errorMessage)
          throw error
        }        
      }
      const body = await response.json()
      console.log("New Concert Venue was added successfully!", body)
      setShouldRedirect(true)
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    if (validForSubmission()) {
      postNewVenue()
    }
  }

  if (shouldRedirect) {
    return <Redirect to="/" />
  }

  return (
    <>
      <h1>New Favorite Concert Venue</h1>
      <form onSubmit={handleSubmit}>
        <ErrorList errors={errors} />
        <label htmlFor="name">
          Name
          <input type="text" 
            name="name" 
            onChange={handleInputChange} 
            value={newVenue.name} 
          />
        </label>
        <label htmlFor="location">
          Location
          <input
            type="text"
            name="location"
            onChange={handleInputChange}
            value={newVenue.location}
          />
        </label>
        <label htmlFor="capacity">
          Capacity
          <input
            type="text"
            name="capacity"
            onChange={handleInputChange}
            value={newVenue.capacity}
          />
        </label>
        <input type="submit" className="button" />
      </form>
    </>
  )
}

export default NewConcertVenueForm
