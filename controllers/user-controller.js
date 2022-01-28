const { User, Thought } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find({})
    .select('-_v')
    .then(dbUserData = res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
    .populate([
      { path: 'thoughts', select: "-_v" },
      { path: 'friends', select: "-_v" }
    ])
    .select('-_v')
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({message: 'No user found with this id'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
  },

  updateUser({ params, body}, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({message: 'No user found with this id'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({message: 'No user found with this id'});
        return;
      }
      User.updataMany(
        { _id: {$in: dbUserData.friends} },
        { $pull: {friends: params.id} }
      )
      .then(() => {
        Thought.deleteMany({ username: dbUserData.username })
        .then(() => {
          res.json({message: 'Successfully deleted user'});
        })
        .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
    })
    .catch(err = res.status(400).json(err));
  },

  addFriend({ params }, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this userId' });
            return;
        }
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $addToSet: { friends: params.userId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData2 => {
            if(!dbUserData2) {
                res.status(404).json({ message: 'No user found with this friendId' })
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
  },

  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this userId' });
            return;
        }
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $pull: { friends: params.userId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData2 => {
            if(!dbUserData2) {
                res.status(404).json({ message: 'No user found with this friendId' })
                return;
            }
            res.json({message: 'Successfully deleted the friend'});
        })
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
  }
}

module.exports = userController;