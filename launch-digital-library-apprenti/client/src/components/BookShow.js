import React, { useState, useEffect } from "react"
import NoteForm from "./NoteForm"
import NoteItem from "./NoteItem"

const BookShow = (props) => {
  const [book, setBook] = useState({})
  const [notes, setNote] = useState([])

  const getBook = async () => {
    try {
      const bookId = props.match.params.id
      const response = await fetch(`/api/v1/books/${bookId}`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const responseBody = await response.json()
      setBook(responseBody.book)
      setNote(responseBody.book.notes)
      console.log(responseBody.book.notes)
    } catch(err) {
      console.error(`Error in Fetch: ${err.message}`)
    }
  }

  useEffect(() => {
    getBook()
  }, [])
  
  let descriptionSection
  if(book.description) {
    descriptionSection = <p>{book.description}</p>
  }

  let fictionSection
  if(book.fiction == true) {
    fictionSection = <p><em>This book is fictional.</em></p>
  }

  const addNewNote = async (formPayLoad) => {
    try {
      const response = await fetch("/api/v1/notes", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(formPayLoad)
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
        setNote([...notes, body.note])
      }
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }
  
  
  let notesList, noteHeader
  if (notes.length !== 0) {
    noteHeader = <h4>{book.title}'s Note</h4>
    notesList = notes.map( note => {
      return (
        <NoteItem key={note.id} note={note}/>
      )
    })
  }

  return (
    <>
      <h1>{book.title}</h1>
      <h2>{book.author}</h2>
      <h3>{book.pagecount} pages</h3>
      {descriptionSection}
      {fictionSection}

      <br/>
      <br/>
      {noteHeader}
      {notesList}
      <NoteForm currentBook = {props.match.params.id}  addNewNote={addNewNote}/>      
    </>
  )
}

export default BookShow