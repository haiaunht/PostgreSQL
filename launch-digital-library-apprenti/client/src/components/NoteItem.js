import React from "react"

const NoteItem = props => {
  const dateData = props.note.date
  const dataDisplay = dateData.substring(0, 10)
  return (
    <div>
      <ul>
        <li><strong>Date: </strong>{dataDisplay}</li>
        <li><strong>Tille: </strong>{props.note.title}</li>
        <li><strong>About: </strong>{props.note.body}</li>
      </ul>
    </div>
  )
}

export default NoteItem