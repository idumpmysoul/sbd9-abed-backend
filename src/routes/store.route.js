const storeController = require('../controller/store.controller');
const express = require('express');
const router = express.Router();

// Route for fetching all stores
router.get('/getAll', storeController.getAllStores);

// Route for creating a new store
router.post('/create', storeController.createStore);

// Route for fetching a store by ID
router.get('/:id', storeController.getStoreId);

// Route for updating a store
router.put('/', storeController.updateStore);

// Route for deleting a store
router.delete('/:id', storeController.deleteStore);

module.exports = router;

