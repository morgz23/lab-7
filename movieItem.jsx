import Card from 'react-bootstrap/Card';

const MovieItem = (props) => {
    return (
        <div className="col-md-4 mb-4">
            <Card className="text-center h-100">
                <Card.Body>
                    <Card.Title>{props.mymovie.Title}</Card.Title>
                    <img
                        src={props.mymovie.Poster}
                        alt={`${props.mymovie.Title} poster`}
                        className="img-fluid"
                        style={{ maxHeight: '420px', objectFit: 'cover' }}
                    />
                </Card.Body>
                <Card.Footer className="text-muted">{props.mymovie.Year}</Card.Footer>
            </Card>
        </div>
    );
};

export default MovieItem;