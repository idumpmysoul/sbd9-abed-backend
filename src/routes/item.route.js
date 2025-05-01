// src/routes/item.route.js
const express = require('express');
const router = express.Router();
const itemController = require('../controller/item.controller');
const upload = require('../utils/multer.util');

// Create new item with image upload
router.post('/create', upload.single('image'), itemController.createItem);

// Get all items
router.get('/', itemController.getAllItems);

// Get item by ID
router.get('/byId/:id', itemController.getItemById);

// Get items by store ID
router.get('/byStoreId/:store_id', itemController.getItemsByStoreId);

// Update item with optional image upload
router.put('/', upload.single('image'), itemController.updateItem);

// Delete item
router.delete('/:id', itemController.deleteItem);

module.exports = router;
