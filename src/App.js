import { useEffect, useState } from "react";
import { Loader } from "./components/Loader";
import { Main } from "./components/Main";
import { Navbar } from "./components/Navbar";
import { Logo } from "./components/Logo";
import { Search } from "./components/Search";
import { NumResults } from "./components/NumResults";
import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { MovieDetails } from "./components/MovieDetails";
import { WatchedList } from "./components/WatchedList";

export const average = (arr) =>
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
  const [isMobile, setIsMobile] = useState(false);

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
    setSelectedMovie(null);
    fetchApi();
    return () => controller.abort();
  }, [query]);

  function handleAddWatched(movie) {
    const filterArr = watched.filter((m) => m.imdbID !== movie.imdbID);
    setWatched((watched) => [...filterArr, movie]);
    setSelectedMovie(null);
  }

  function handleDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 950);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Navbar>
        <Logo isMobile ={isMobile}/>
        <Search query={query} setQuery={setQuery} />
        {!isMobile && <NumResults movies={movies} />}
      </Navbar>
      <Main>
        {!isMobile && <Box>
          {!isLoading && errorMsg && <ErrorMsg errorMsg={errorMsg} />}
          {isLoading && <Loader />}
          {!isLoading && !errorMsg && (
            <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
        </Box>}
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

function ErrorMsg({ errorMsg }) {
  return <p className="loader">{errorMsg}</p>;
}
