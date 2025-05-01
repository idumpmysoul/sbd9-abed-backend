// src/controller/item.controller.js
const itemRepository = require('../repositories/item.repository');
const baseResponse = require('../utils/baseResponse.util');
const cloudinary = require('../utils/cloudinary.util');
const fs = require('fs');

// Create new item
exports.createItem = async (req, res) => {
  try {
    const { name, price, store_id, stock } = req.body;
    
    // Validate required fields
    if (!name || !price || !store_id || !req.file) {
      return baseResponse(res, false, 400, "Missing required fields", null);
    }
    
    // Check if the store exists
    const storeExists = await itemRepository.checkStoreExists(store_id);
    if (!storeExists) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }
    
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'items',
      use_filename: true
    });
    
    // Remove file from local storage after upload
    fs.unlinkSync(req.file.path);
    
    // Create new item with image URL from Cloudinary
    const newItem = await itemRepository.createItem({
      name,
      price: parseInt(price),
      store_id,
      image_url: result.secure_url,
      stock: parseInt(stock) || 0
    });
    
    baseResponse(res, true, 201, "Item created", newItem);
  } catch (error) {
    console.error(error);
    baseResponse(res, false, 500, "Server Error", null);
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    baseResponse(res, true, 200, "Items found", items);
  } catch (error) {
    console.error(error);
    baseResponse(res, false, 500, "Server Error", null);
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await itemRepository.getItemById(id);
    
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    
    baseResponse(res, true, 200, "Item found", item);
  } catch (error) {
    console.error(error);
    baseResponse(res, false, 500, "Server Error", null);
  }
};

// Get items by store ID
exports.getItemsByStoreId = async (req, res) => {
  try {
    const { store_id } = req.params;
    
    // Check if the store exists
    const storeExists = await itemRepository.checkStoreExists(store_id);
    if (!storeExists) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }
    
    const items = await itemRepository.getItemsByStoreId(store_id);
    baseResponse(res, true, 200, "Items found", items);
  } catch (error) {
    console.error(error);
    baseResponse(res, false, 500, "Server Error", null);
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { id, name, price, store_id, stock } = req.body;
    
    // Validate required fields
    if (!id || !name || !price || !store_id) {
      return baseResponse(res, false, 400, "Missing required fields", null);
    }
    
    // Check if the item exists
    const existingItem = await itemRepository.getItemById(id);
    if (!existingItem) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    
    // Check if the store exists
    const storeExists = await itemRepository.checkStoreExists(store_id);
    if (!storeExists) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }
    
    let imageUrl = existingItem.image_url;
    
    // If there's a new image, upload it to Cloudinary
    if (req.file) {
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'items',
        use_filename: true
      });
      
      // Remove file from local storage after upload
      fs.unlinkSync(req.file.path);
      
      // Update image URL
      imageUrl = result.secure_url;
    }
    
    // Update item
    const updatedItem = await itemRepository.updateItem(id, {
      name,
      price: parseInt(price),
      store_id,
      image_url: imageUrl,
      stock: parseInt(stock) || existingItem.stock
    });
    
    baseResponse(res, true, 200, "Item updated", updatedItem);
  } catch (error) {
    console.error(error);
    baseResponse(res, false, 500, "Server Error", null);
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the item exists
    const existingItem = await itemRepository.getItemById(id);
    if (!existingItem) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    
    // Delete item
    const deletedItem = await itemRepository.deleteItem(id);
    
    baseResponse(res, true, 200, "Item deleted", deletedItem);
  } catch (error) {
    console.error(error);
    baseResponse(res, false, 500, "Server Error", null);
  }
};
