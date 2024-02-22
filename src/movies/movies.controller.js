const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function list(req, res) {
    const { is_showing } = req.query
    if (is_showing) {
       res.status(200).json({ data:  await moviesService.listMoviesShowing() })
    } else {
        res.status(200).json({ data: await moviesService.list() })
    }
} 

async function movieIdExists(req, res, next) {
    const { movieId } = req.params;
    const movie = await moviesService.read(movieId)
    if(movie) {
        res.locals.movie = movie
        return next()
    }
    next({
        status: 404,
        message: `Movie cannot be found` 
    })
}

async function read(req, res) {
    const { movie } = res.locals;
    res.json({ data: movie })
}

async function getTheaters(req, res, next) {
    const { movieId } = req.params;
   const result = await moviesService.getTheaters(movieId)
    res.json({ data: result})
}

async function getReviews(req, res, next) {
    const {movieId} = req.params;
    const reviews = await moviesService.getReviews(movieId)
    const result = [];

    for(let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        const critic = await moviesService.getCritics(review.critic_id)
        review.critic = critic[0]
        result.push(review)
    }
    res.status(200).json({ data: result })
}


module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieIdExists), asyncErrorBoundary(read)],
    getTheaters: [asyncErrorBoundary(movieIdExists), asyncErrorBoundary(getTheaters)],
    getReviews: [asyncErrorBoundary(movieIdExists), asyncErrorBoundary(getReviews)]
};