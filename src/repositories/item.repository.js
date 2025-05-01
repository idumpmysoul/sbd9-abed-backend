// src/repositories/item.repository.js
const db = require('../database/pg.database');

// Create new item
exports.createItem = async (item) => {
  try {
    const res = await db.query(
      "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [item.name, item.price, item.store_id, item.image_url, item.stock]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

// Get all items
exports.getAllItems = async () => {
  try {
    const res = await db.query("SELECT * FROM items ORDER BY created_at DESC");
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

// Get item by ID
exports.getItemById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

// Get items by store ID
exports.getItemsByStoreId = async (storeId) => {
  try {
    const res = await db.query("SELECT * FROM items WHERE store_id = $1 ORDER BY created_at DESC", [storeId]);
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

// Update item
exports.updateItem = async (id, item) => {
  try {
    const res = await db.query(
      "UPDATE items SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5 WHERE id = $6 RETURNING *",
      [item.name, item.price, item.store_id, item.image_url, item.stock, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

// Delete item
exports.deleteItem = async (id) => {
  try {
    const res = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

// Check if store exists
exports.checkStoreExists = async (storeId) => {
  try {
    const res = await db.query("SELECT * FROM stores WHERE id = $1", [storeId]);
    return res.rows.length > 0;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
};

exports.payTransaction = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Get transaction
        const transaction = await transactionRepository.getTransactionById(id);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        
        // Check if already paid
        if (transaction.status === 'paid') {
            return baseResponse(res, false, 400, "Transaction already paid", null);
        }
        
        // Get user
        const user = await userRepository.getUserById(transaction.user_id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        
        // Check balance
        if (user.balance < transaction.total) {
            return baseResponse(res, false, 400, "Insufficient balance", null);
        }
        
        // Update balance
        const newBalance = user.balance - transaction.total;
        await userRepository.updateBalance(user.id, newBalance);
        
        // Update transaction status
        const updatedTransaction = await transactionRepository.updateTransactionStatus(id, 'paid');
        
        // Update item stock - using existing item repository methods
        const item = await itemRepository.getItemById(transaction.item_id);
        const newStock = item.stock - transaction.quantity;
        await itemRepository.updateItem(item.id, {
            name: item.name,
            price: item.price,
            store_id: item.store_id,
            image_url: item.image_url,
            stock: newStock
        });
        
        baseResponse(res, true, 200, "Payment successful", updatedTransaction);
    } catch (error) {
        baseResponse(res, false, 500, "Failed to pay", error);
    }
};
