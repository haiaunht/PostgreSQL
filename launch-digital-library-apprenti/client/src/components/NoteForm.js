import React, {  useState } from "react"
import ErrorList from "./ErrorList"

const NoteForm = props => {  
  console.log("bookID: = " + typeof props.currentBook + props.currentBook)

  const [noteRecord, setNoteRecord] = useState({
    date: "",
    title: "",
    body: "",
    bookId: props.currentBook
  })
  const [errors, setErrors] = useState([])  

  
  const handleChange = (event) => {
    event.preventDefault()
    setNoteRecord({
      ...noteRecord,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }

  const validForSubmission = () => {
    let submitErrors = {}
    const requiredFields = ["date", "title", 'body']
    requiredFields.forEach(field => {
      if (noteRecord[field].trim() === "") {
        submitErrors = {...submitErrors, [field]:"is blank"}
      }
    })

    setErrors(submitErrors)
    return _.isEmpty(submitErrors)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if(validForSubmission()) {
      props.addNewNote(noteRecord)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ErrorList errors = {errors}/>
      <h5>Add a New Note</h5>
      <label htmlFor="date">Date
        <input
          id="date"
          type="date"
          name="date"
          onChange={handleChange}
          value={noteRecord.date}
        />
      </label>

      <label htmlFor="title">Title
        <input
          id="title"
          type="text"
          name="title"
          onChange={handleChange}
          value={noteRecord.title}
        />
      </label>

      <label htmlFor="body">Body
        <input
          id="body"
          type="text"
          name="body"
          onChange={handleChange}
          value={noteRecord.body}
        />
      </label>     

      <input type="submit" value="Add this Note" />
    </form>
  )
}

export default NoteForm