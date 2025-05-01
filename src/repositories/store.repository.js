const db = require('../database/pg.database');

// Get all stores
exports.getAllStores = async () => {
    try {
        const res = await db.query("SELECT * FROM stores");
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

// Create a new store
exports.createStore = async (store) => {
    try {
        const res = await db.query(
            "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
            [store.name, store.address]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

// Get a store by ID
exports.getStoreId = async (storeId) => {
    try {
        const res = await db.query("SELECT * FROM stores WHERE id = $1", [storeId]);
        return res.rows[0]; // Return the first row if found, otherwise null
    } catch (error) {
        console.error("Error executing query", error);
    }
};

// Update a store by ID
exports.updateStore = async (id, updatedStore) => {
    try {
        const res = await db.query(
            "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
            [updatedStore.name, updatedStore.address, id]
        );
        return res.rows[0]; // Return the updated store
    } catch (error) {
        console.error("Error executing query", error);
    }
};

// Delete a store by ID
exports.deleteStore = async (storeId) => {
    try {
        const res = await db.query(
            "DELETE FROM stores WHERE id = $1 RETURNING *",
            [storeId]
        );
        return res.rows[0]; // Return the deleted store
    } catch (error) {
        console.error("Error executing query", error);
    }
};

