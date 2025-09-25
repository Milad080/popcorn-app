import { useCallback, useEffect, useRef, useState } from "react";
import { useMovies } from "./useMovies";
import StarRating from "./StarRating";
import { useLocalStorageState } from "./useLocalStorage";
import StreamingLinks from "./StreamingLinks";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "81488cee";

function App() {
  const [query, setQuery] = useState("");
  const [watchedMovies, setWatchedMovies] = useLocalStorageState([], "watched");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  function handleSelectedMovie(id) {
    setSelectedId((curSelected) => (curSelected === id ? null : id));
  }
  function handleAddWatched(movie) {
    setWatchedMovies((watchedMovies) => [...watchedMovies, movie]);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleDeleteWatched(id) {
    setWatchedMovies((watched) =>
      watched.filter((movie) => movie.imdbID !== id)
    );
  }

  return (
    <>
      <Navbar>
        <NavSearch query={query} setQuery={setQuery} />
        <NavNumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {selectedId ? (
            <MovieDetails
              watchedMovies={watchedMovies}
              selectedId={selectedId}
              onAddWatched={handleAddWatched}
              onCloseMovie={handleCloseMovie}
            />
          ) : (
            <>
              <WatchedMoviesSummary watchedMovies={watchedMovies} />
              <WatchedMoviesList
                watchedMovies={watchedMovies}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && error && <ErrorMessage message={error} />}
          <MoviesList movies={movies} onSelectedMovie={handleSelectedMovie} />
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">...درحال بارگزاری</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span> {message}
    </p>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <NavLogo />
      {children}
    </nav>
  );
}
function NavLogo() {
  return (
    <h1 className="nav-logo">
      <span role="img">🍿</span>
      popcorn app
    </h1>
  );
}
function NavSearch({ query, setQuery }) {
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="nav-search"
      placeholder="فیلم مورد نظر را جستجو کنید..."
    />
  );
}
function NavNumResult({ movies }) {
  const results = movies.length;
  return <h1 className="nav-result">{results} نتیجه</h1>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}
function MoviesList({ movies, onSelectedMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          onSelectedMovie={onSelectedMovie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <div className="title">
        <h1>{movie.Title}</h1>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function WatchedMoviesSummary({ watchedMovies }) {
  const avgImdbRating = average(watchedMovies.map((movie) => movie.imdbRating));
  const avgUserRating = average(watchedMovies.map((movie) => movie.userRating));
  const avgRuntime = average(watchedMovies.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>خلاصه ای از فیلم هایی که به لیست اضافه کرده اید </h2>
      <div>
        <p>
          <span>{watchedMovies.length} فیلم </span>
          <span>#️⃣</span>
        </p>
        <p>
          <span>{Number(avgImdbRating.toFixed(2))}</span>
          <span>⭐️</span>
        </p>
        <p>
          <span>{Number(avgUserRating.toFixed(2))}</span>
          <span>🌟</span>
        </p>
        <p>
          <span>{Number(avgRuntime.toFixed(2))} دقیقه </span>
          <span>⏳</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMoviesList({ watchedMovies, onDeleteWatched }) {
  return (
    <ul className="watched">
      {watchedMovies.map((watched) => (
        <WatchedMovie
          watched={watched}
          onDeleteWatched={onDeleteWatched}
          key={watched.imdbID}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ watched, onDeleteWatched }) {
  return (
    <li>
      <button
        onClick={() => onDeleteWatched(watched.imdbID)}
        className="btn-del-item"
      >
        x
      </button>
      <img src={watched.poster} alt={`${watched.title} poster`} />
      <div>
        <div>
          <h3>{watched.title}</h3>
          <p>
            <span>⭐️</span>
            <span>{watched.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{watched.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span> {watched.runtime} دقیقه </span>
          </p>
        </div>
      </div>
    </li>
  );
}

const translationCache = {};

async function translateToPersian(text) {
  if (!text || text.length < 20) return text;

  if (translationCache[text]) {
    return translationCache[text];
  }

  try {
    const response = await fetch(
      `http://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|fa`
    );
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      translationCache[text] = translated;
      return translated;
    }
    return text;
  } catch (error) {
    return text;
  }
}

function MovieDetails({
  watchedMovies,
  selectedId,
  onAddWatched,
  onCloseMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [translatedPlot, setTranslatedPlot] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const iswatchedMovies = watchedMovies
    .map((movie) => movie.imdbID)
    .includes(selectedId);
  const watchedUserRating = watchedMovies.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleTranslatePlot = useCallback(async () => {
    if (!plot) return;

    setIsTranslating(true);
    try {
      const translated = await translateToPersian(plot);
      setTranslatedPlot(translated);
    } catch (error) {
      setTranslatedPlot(plot);
    } finally {
      setIsTranslating(false);
    }
  }, [plot]);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsloading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsloading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(() => {
    if (plot && !translatedPlot) {
      handleTranslatePlot();
    }
  }, [plot, translatedPlot, handleTranslatePlot]);

  useEffect(
    function () {
      if (!title) return;
      document.title = `movie | ${title}`;
      return function () {
        document.title = "usePOPCORN";
      };
    },
    [title]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`poster of${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{year}</p>
              <p>{released}</p>
              <p>{runtime}</p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} imdb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!iswatchedMovies ? (
                <>
                  <p className="rate-text">
                    اگر این فیلم را قبلا تماشا کرده اید امتیاز خود را ثبت کنید
                  </p>
                  <StarRating
                    maxRating={10}
                    size={20}
                    onSetRating={setUserRating}
                  />
                  <button className="btn-add" onClick={handleAdd}>
                    + افزودن به لیست
                  </button>
                </>
              ) : (
                <p className="rated">
                  شما قبلا این فیلم را به لیست افزوده اید داده اید
                  <span>( با امتیاز {watchedUserRating}⭐)</span>
                </p>
              )}
            </div>
            <StreamingLinks movie={movie} />

            <div className="more-details">
              <div className="plot-section">
                <p>
                  <em>
                    <span>خلاصه فیلم : </span>
                    <br />
                    {isTranslating ? (
                      <span className="translating-text">در حال ترجمه...</span>
                    ) : (
                      <>
                        {showOriginal ? plot : translatedPlot || plot}
                        {translatedPlot && (
                          <button
                            className="toggle-translation"
                            onClick={() => setShowOriginal(!showOriginal)}
                          >
                            {showOriginal
                              ? "نمایش ترجمه فارسی"
                              : "نمایش متن اصلی"}
                          </button>
                        )}
                      </>
                    )}
                  </em>
                </p>
              </div>
              <p className="detail">
                <span>بازیگران :</span>
                <br /> {actors}
              </p>
              <p className="detail">
                <span>کارگردان :</span>
                <br /> {director}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
export default App;
