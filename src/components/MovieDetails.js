import { useEffect, useState } from "react";
import StarRating from "./StarRating";

export function MovieDetails({
  selectedMovie,
  setSelectedMovie,
  handleAddWatched,
  watched,
}) {
  const [userRating, setUserRating] = useState(0);
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Release: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbID,
  } = selectedMovie;

  function handleAdd() {
    handleAddWatched({
      imdbID,
      title,
      userRating,
      imdbRating: Number(imdbRating),
      poster,
      runtime: parseInt(runtime.split(" ").at(0)),
    });
  }

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => {
      document.title = "UsePopcorn";
    };
  }, [title]);

  useEffect(() => {
    const func = (e) => {
      if (e.code === "Escape") {
        setSelectedMovie(null);
      }
    };
    document.addEventListener("keydown", func);
    return () => document.removeEventListener("keydown", func);
  }, [setSelectedMovie]);

  const isWatched = watched.filter((m) => m.imdbID === imdbID).at(0);

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={() => setSelectedMovie(null)}>
          <i className="uil uil-angle-left-b"></i>
        </button>
        <img src={poster} alt="_" />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDB rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating
            maxRating={10}
            size={24}
            onSetRating={setUserRating}
            defaultRating={isWatched ? isWatched.userRating : 0}
          />
          {userRating > 0 && (
            <button className="btn-add" onClick={handleAdd}>
              {isWatched ? "Edit rating" : "+ Add to list"}
            </button>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>
          <b>Starring : </b>
          {actors}
        </p>
        <p>
          <b>Directed by : </b>
          {director}
        </p>
      </section>
    </div>
  );
}
