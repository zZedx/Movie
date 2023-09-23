import { MovieListItems } from "./MovieListItems";

export function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieListItems
          movie={movie}
          handleSelectMovie={handleSelectMovie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
