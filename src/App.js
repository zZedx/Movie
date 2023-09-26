import { useEffect, useState } from "react";
import { Loader } from "./components/Loader";
import { Main } from "./components/Main";
import { Navbar } from "./components/Navbar";
import { Logo } from "./components/Logo";
import { Search } from "./components/Search";
import Login  from "./components/LoginButton";
import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { MovieDetails } from "./components/MovieDetails";
import { WatchedList } from "./components/WatchedList";
import { useLocalStorage } from "./components/useLocalStorage";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "e10fb94b";
export default function App() {
  const [movies, setMovies] = useState([]);
  
  const [watched , setWatched] = useLocalStorage([] , 'watched')

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [query, setQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSearchMovie, setShowSearchMovie] = useState(false);

  async function handleSelectMovie(id) {
    setShowSearchMovie(false)
    setIsLoading2(true);
    const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${KEY}`);
    const data = await res.json();
    setSelectedMovie((selectedMovie) =>
      selectedMovie?.imdbID === id ? null : data
    );
    setIsLoading2(false);
  }

  function handleAddWatched(movie) {
    isMobile && setQuery('')
    const filterArr = watched.filter((m) => m.imdbID !== movie.imdbID);
    setWatched((watched) => [...filterArr, movie]);
    // localStorage.setItem('watched' , JSON.stringify([...filterArr , movie]))
    setSelectedMovie(null);
  }

  function handleDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(()=>{
    localStorage.setItem('watched' , JSON.stringify(watched))
  },[watched])

  useEffect(() => {
    const controller = new AbortController();
    async function fetchApi() {
      try {
        setErrorMsg("");
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Something went wrong");
        const data = await res.json();
        if (data.Error) throw new Error(data.Error);
        setMovies(data.Search);
        setShowSearchMovie(true)
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
        <Logo isMobile={isMobile} />
        <Search query={query} setQuery={setQuery} />
        {!isMobile && <Login />}
        {isMobile && <Toggler/>}
      </Navbar>
      {!isMobile ? (
        <Main>
          <Box>
            {!isLoading && errorMsg && <ErrorMsg errorMsg={errorMsg} />}
            {isLoading && <Loader />}
            {!isLoading && !errorMsg && (
              <MovieList
                movies={movies}
                handleSelectMovie={handleSelectMovie}
              />
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
      ) : (
        <Main>
          {showSearchMovie ? (
            <Box isMobile={isMobile}>
              {!isLoading && errorMsg && <ErrorMsg errorMsg={errorMsg} />}
              {isLoading && <Loader />}
              {!isLoading && !errorMsg && (
                <MovieList
                  movies={movies}
                  handleSelectMovie={handleSelectMovie}
                />
              )}
            </Box>
          ) : (
            <Box isMobile={isMobile}>
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
          )}
        </Main>
      )}
    </>
  );
}

function Toggler(){
  const toggleStyle ={
    fontSize : '2rem'
  }
  return <span style={toggleStyle}><i className="uil uil-ellipsis-v"></i></span>
}

function ErrorMsg({ errorMsg }) {
  return <p className="loader">{errorMsg}</p>;
}
