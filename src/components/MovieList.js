import { MovieListItems } from "./MovieListItems";

export function MovieList({ movies, handleSelectMovie , setShowSearchMovie , isMobile}) {
  return (
    <ul className="list list-movies">
      {isMobile && <button className="btn-back" onClick={() => setShowSearchMovie(null)}>
          <i className="uil uil-angle-left-b"></i>
        </button>}
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
