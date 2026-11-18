import MovieItem from './movieItem';

const Movies = (props) => {
    return (
        <div className="row">
            {props.myMovies.map((movie) => (
                <MovieItem mymovie={movie} key={movie.imdbID} />
            ))}
        </div>
    );
};

export default Movies;