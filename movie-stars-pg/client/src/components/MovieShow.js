import React, { useState, useEffect } from "react"

const MovieShow = (props) => {
  const [movie, setMovie] = useState([])

  const getMovie = async () => {
    let id = props.match.params.id
    try {
      const response = await fetch(`/api/v1/movies/${id}`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw error
      }
      const responseBody = await response.json()
      setMovie(responseBody.movie)
    } catch (err) {
      console.error("Error in fetch!")
      console.error(err)
    }
  }

  useEffect(() => {
    getMovie()
  }, [])

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>Genre: {movie.genre}</p>
      <p>Description: {movie.description}</p>
    </div>
  )
}

export default MovieShow
