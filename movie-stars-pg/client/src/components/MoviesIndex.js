import React, { useState, useEffect } from "react"

import MovieTile from "./MovieTile"

const MoviesIndex = (props) => {
  const [movies, setMovies] = useState([])

  const getMovies = async () => {
    try {
      const response = await fetch("/api/v1/movies")
      
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw error
      }
      const responseBody = await response.json()
      
      setMovies(responseBody.movies)
    } catch (err) {
      console.error("Error in fetch!")
      console.error(err)
    }
  }

  useEffect(() => {
    getMovies()
  }, [])

  const movieTiles = movies.map((movie) => {
    return <MovieTile key={movie.id} title={movie.title} />
  })

  return (
    <div>
      <h1>All the movies!</h1>
      <ul>{movieTiles}</ul>
    </div>
  )
}

export default MoviesIndex
