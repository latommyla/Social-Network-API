const router = require('express').Router();
const {
    getAllThoughts,
    addThought,
    getThoughtById,
    updateThought,
    removeThought,
    addReaction,
    removeReaction
} = require('../../controllers/thought-controller');
const { route } = require('./user-routes');

router.route('/').get(getAllThoughts);

router.route('/:userId').post(addThought);

// Set up GET all and POST
router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)

// Remove a thought   
router
    .route('/:userId/:thoughtId')
    .delete(removeThought);

// Add a reaction
router
    .route('/:thoughtId/reactions')
    .post(addReaction);

// Delete a reaction
router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(removeReaction);

module.exports = router;