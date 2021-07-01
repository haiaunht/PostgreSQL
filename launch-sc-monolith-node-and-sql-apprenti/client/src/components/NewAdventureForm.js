import React, { useState } from "react"
import { Redirect, Link } from "react-router-dom"
import ErrorList from "./ErrorList"

const NewAdventureForm = props => {
  const [newAdventure, setNewAdventure] = useState({
    title: "",
    location: ""
  })
  const [errors, setErrors] = useState([])
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const addNewAdventure = async () => {
    try {
      const response = await fetch("/api/v1/adventures", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(newAdventure)
      })
      if (!response.ok) {
        if(response.status === 422) {
          const body = await response.json()
          const newErrors = translateServerErrors(body.errors)
          return setErrors(newErrors)
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

  const handleInputChange = event => {
    setNewAdventure({
      ...newAdventure,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addNewAdventure()
  }

  if (shouldRedirect) {
    return <Redirect to="/adventures" />
  }

  return (
    <>
      <h1>Dream Up a New Adventure!</h1>
      <ErrorList errors={errors} />
      <form onSubmit={handleSubmit} className="callout" >
        <label>
         Title:
          <input
            type="text"
            name="title"
            onChange={handleInputChange}
            value={newAdventure.title}
          />
        </label>

        <label>
          Location:
          <input
            type="text"
            name="location"
            onChange={handleInputChange}
            value={newAdventure.location}
          />
        </label>
        
        <div className="button-group">
          <input className="button" type="submit" value="Submit" />
        </div>
      </form>
      <h3><Link to="/adventures">Back to All Adventures!</Link></h3>
    </>
  )
}

export default NewAdventureForm