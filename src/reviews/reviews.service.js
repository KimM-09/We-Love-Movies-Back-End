const knex = require("../db/connection");

function read(review_id) {
    return knex("reviews")
    .select("*")
    .where({ review_id }).first()
}

function destroy(review_id) {
    return knex("reviews")
    .where({review_id}).del();
}

function update(updatedReview) {
    return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then(() => {
        return knex("critics")
        .select("*")
        .where({ critic_id: updatedReview.critic_id})
        .first();
    });
}
 
module.exports = {
read,
update,
delete: destroy
}