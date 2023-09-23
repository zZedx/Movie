import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "e10fb94b";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [query, setQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  async function handleSelectMovie(id) {
    setIsLoading2(true);
    const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${KEY}`);
    const data = await res.json();
    setSelectedMovie((selectedMovie) =>
      selectedMovie?.imdbID === id ? null : data
    );
    setIsLoading2(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function fetchApi() {
      try {
        setErrorMsg("");
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        if (data.Error) throw new Error(data.Error);
        setMovies(data.Search);
        setErrorMsg("");
      } catch (e) {
        if (e.name !== "AbortError") setErrorMsg(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setErrorMsg("");
      return;
    }
    setSelectedMovie(null)
    fetchApi();
    return ()=> controller.abort()
  }, [query]);

  function handleAddWatched(movie) {
    const filterArr = watched.filter((m) => m.imdbID !== movie.imdbID);
    setWatched((watched) => [...filterArr, movie]);
    setSelectedMovie(null);
  }

  function handleDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // const [isMobile, setIsMobile] = useState(false);
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 950);
  //   };
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {!isLoading && errorMsg && <ErrorMsg errorMsg={errorMsg} />}
          {isLoading && <Loader />}
          {!isLoading && !errorMsg && (
            <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
        </Box>
        {
          <Box>
            {isLoading2 ? (
              <Loader />
            ) : selectedMovie ? (
              <MovieDetails
                watched={watched}
                selectedMovie={selectedMovie}
                setSelectedMovie={setSelectedMovie}
                handleAddWatched={handleAddWatched}
              />
            ) : (
              <WatchedList watched={watched} handleDelete={handleDelete} />
            )}
          </Box>
        }
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorMsg({ errorMsg }) {
  return <p className="loader">{errorMsg}</p>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, handleSelectMovie }) {
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

function MovieListItems({ movie, handleSelectMovie }) {
  return (
    <li onClick={() => handleSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title}`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
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

  useEffect(()=>{
    const func = (e)=>{
      if(e.code === 'Escape'){
        setSelectedMovie(null)
      }
    }
    document.addEventListener('keydown' , func)
    return ()=> document.removeEventListener('keydown' , func)
  },[setSelectedMovie])

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

function WatchedList({ watched, handleDelete }) {
  return (
    <>
      <Summary watched={watched} />
      <ul className="list">
        {watched.map((movie) => (
          <WatchedListItems
            movie={movie}
            handleDelete={handleDelete}
            key={movie.imdbID}
          />
        ))}
      </ul>
    </>
  );
}

function WatchedListItems({ movie, handleDelete }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleDelete(movie.imdbID)}
        >
          <i className="uil uil-times"></i>
        </button>
      </div>
    </li>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}
