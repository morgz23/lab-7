// Import the Express framework used to create the web server.
const express = require('express');

// Import CORS so the React app can make requests from a different port.
const cors = require('cors');

// Import body-parser to read JSON and form data sent in request bodies.
const bodyParser = require('body-parser');

// Import Mongoose to connect to MongoDB and create models.
const mongoose = require('mongoose');

// Create the Express application.
const app = express();

// Set the port used by the movie API.
const port = 4000;

// Allow cross-origin requests from the React application.
app.use(cors());

// Allow the server to read URL-encoded form data.
app.use(bodyParser.urlencoded({ extended: true }));

// Allow the server to read JSON data sent by POST requests.
app.use(bodyParser.json());

// Add HTTP headers that allow requests from the React app.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Define the structure of a movie document in MongoDB.
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: String, required: true },
    poster: { type: String, required: true }
});

// Create the Mongoose model named Movie.
// Mongoose stores documents from this model in the movies collection.
const Movie = mongoose.model('Movie', movieSchema);

// Use MONGODB_URI when it is set, otherwise use the Atlas connection below.
const mongoConnectionString = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.f8onxz8.mongodb.net/lab_6?retryWrites=true&w=majority';

// Connect the server to MongoDB before starting the API.
async function connectToDatabase() {
    try {
        await mongoose.connect(mongoConnectionString);
        console.log('Connected to MongoDB database: lab_6');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
}

// Provide a simple response at the server root URL.
app.get('/', (req, res) => {
    res.send('Movie server is running');
});

// Retrieve every movie document from the movies collection.
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to retrieve movies' });
    }
});

// Add a new movie to the MongoDB movies collection.
app.post('/api/movies', async (req, res) => {
    // Read the movie fields sent by the React Create component.
    const { title, year, poster } = req.body;

    // Stop the request if any required field is missing.
    if (!title || !year || !poster) {
        return res.status(400).json({ message: 'Title, year and poster are required' });
    }

    try {
        // Create a Mongoose document using the submitted values.
        const newMovie = new Movie({ title, year, poster });

        // Save the document permanently in MongoDB.
        await newMovie.save();

        // Return success and the newly created movie document.
        res.status(201).json({
            message: 'Movie created successfully',
            movie: newMovie
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to add movie' });
    }
});

// Retrieve one movie using the movie's MongoDB ID.
app.get('/api/movie/:id', async (req, res) => {
    try {
        // Search for the document with the ID supplied in the URL.
        const movie = await Movie.findById(req.params.id);

        // Return 404 if no movie has that ID.
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Send the found movie back to the client.
        res.json(movie);
    } catch (error) {
        console.error(error);

        // Return 400 if the supplied ID is not a valid MongoDB ObjectId.
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        res.status(500).json({ message: 'Unable to retrieve movie' });
    }
});

// Connect to MongoDB first, then start listening for API requests.
connectToDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        // Exit if the database cannot be reached.
        console.error(error.message);
        process.exit(1);
    });