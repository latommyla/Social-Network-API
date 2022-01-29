const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/user-controller');

// Set up GET all and POST
router
    .route('/')
    .get()
    .post();

// Update or remove a user
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)

// Add or remove a friend
router
    .route('/:id/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);

// Gets all users and creates a user
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

module.exports = router;