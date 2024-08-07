const express = require('express');
const router = express.Router();
const movieController = require('../controllers/MovieController');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', movieController.saveMovie);
router.put('/:id', movieController.updateMovie);
router.put('/:movieId/episodes', movieController.addEpisodeToMovie);
router.delete('/:id', movieController.deleteMovie);
router.delete('/:movieId/episode/:episodeId', movieController.deleteEpisodeFromMovie);

module.exports = router;
