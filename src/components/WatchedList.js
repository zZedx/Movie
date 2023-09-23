import { Summary } from "./Summary";
import { WatchedListItems } from "./WatchedListItems";

export function WatchedList({ watched, handleDelete }) {
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
