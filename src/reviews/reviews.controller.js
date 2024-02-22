const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


//Verification middleware
const VALID_PROPERTIES = [
    "content",
    "score",
];

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const invalidFields = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field)
    );

    if(invalidFields.length)
    return next({
        status:400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
    next();
}

async function reviewExists(req, res, next) {
    const review = await reviewsService.read(req.params.reviewId);
        if(review) {
            res.locals.review = review;
            return next()
        }
        next({
            status: 404,
            message: "Review cannot be found."
        })
}


//HTTP
async function update(req, res, next) {
    const updatedReview = {
      ...res.locals.review,
      ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const criticInfo = await reviewsService.update(updatedReview);
  updatedReview.critic = criticInfo;
  res.json({ data: updatedReview })
}

async function destroy(req, res) {
    const { review } = res.locals;
    await reviewsService.delete(review.review_id);
    res.sendStatus(204);
}
 

module.exports = {
    update: [
        asyncErrorBoundary(reviewExists),
        hasOnlyValidProperties,
        asyncErrorBoundary(update),
    ],
    delete: [
        asyncErrorBoundary(reviewExists),
        asyncErrorBoundary(destroy),
    ],
};