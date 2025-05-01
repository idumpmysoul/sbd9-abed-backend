const userController = require('../controller/user.controller');
const express = require('express');
const router = express.Router();

// User routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:email', userController.getUserByEmail);
router.put('/', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/topUp', userController.topUpUser);

module.exports = router;
