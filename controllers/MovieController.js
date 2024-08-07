const { Movie, Episode }  = require('../models/Movie');

// Method to get all movies

exports.getAllMovies = async (req, res) => {
    try {
        // Parse page and size from query parameters, setting defaults
        const page = parseInt(req.query.page, 10) || 0; // Default to page 0
        const size = parseInt(req.query.size, 10) || 20; // Default to 20 items per page

        // Calculate the skip value
        const skip = page * size;

        // Fetch the movies with pagination
        const movies = await Movie.find()
        .skip(skip)
        .limit(size).populate('episodes');

        // Get the total number of movies for pagination info
        const totalMovies = await Movie.countDocuments();

        const currentPage = page + 1;
        // Prepare the response data
        const response = {
            currentPage,
            size,
            totalMovies,
            totalPages: Math.ceil(totalMovies / size),
            movies
        };

        // Send the response
        res.status(200).json(response);
    } catch (err) {
        // Handle any errors
        res.status(500).json({ message: err.message });
    }
};

// Method to get a movie by id
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('episodes');
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Method to save a movie
exports.saveMovie = async (req, res) => {
    const movie = new Movie(req.body);
    try {
        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Method to update a movie
exports.updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json(updatedMovie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Method to add an episode to a movie
exports.addEpisodeToMovie = async (req, res) => {
    const episode = new Episode(req.body);
    try {
        const movie = await Movie.findById(req.params.movieId);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        const savedEpisode = await episode.save();
        // console.log(savedEpisode);
        movie.episodes.push(savedEpisode);
        console.log(movie);
        const updatedMovie = await movie.save();
        res.status(201).json(updatedMovie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Method to delete a movie
exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Method to delete an episode from a movie
// exports.deleteEpisodeFromMovie = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.movieId);
//         if (!movie) return res.status(404).json({ message: 'Movie not found' });
//         console.log(req.params.episodeId);
//         const episodeToDelete = movie.episodes.id(req.params.episodeId);
//         console.log(episodeToDelete);
//         episodeToDelete.remove();
//         await movie.save();
//         res.status(204).json();
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


exports.deleteEpisodeFromMovie = async (req, res) => {
    try {
        const { movieId, episodeId } = req.params;
        // Find the movie and pull the episode from the episodes array
        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            { $pull: { episodes: episodeId } },
            { new: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        await Episode.findByIdAndDelete(episodeId);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
