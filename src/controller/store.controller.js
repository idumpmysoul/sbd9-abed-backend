const storeRepository = require('../repositories/store.repository');
const baseResponse = require('../utils/baseResponse.util');

// Get all stores
exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, "Stores found", stores);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving stores", error);
    }
};

// Create a new store
exports.createStore = async (req, res) => {
    const { name, address } = req.body;
    if (!name || !address) {
        return baseResponse(res, false, 400, "Missing store name or address", null);
    }

    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, "Store created", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

// Get a store by ID
exports.getStoreId = async (req, res) => {
    const storeId = req.params.id;
    if (!storeId) {
        return baseResponse(res, false, 400, "Missing store id", null);
    }

    try {
        const store = await storeRepository.getStoreId(storeId);
        if (store) {
            baseResponse(res, true, 200, "Store found", store);
        } else {
            baseResponse(res, false, 404, "Store not found", null);
        }
    } catch (error) {
        baseResponse(res, false, 500, `Error retrieving store with id = ${storeId}`, error);
    }
};

// Update a store by ID
exports.updateStore = async (req, res) => {
    const { id, name, address } = req.body;

    if (!id || !name || !address) {
        return baseResponse(res, false, 400, "Missing store id, name, or address", null);
    }

    try {
        const store = await storeRepository.updateStore(id, { name, address });
        if (store) {
            baseResponse(res, true, 200, "Store updated", store);
        } else {
            baseResponse(res, false, 404, "Store not found", null);
        }
    } catch (error) {
        baseResponse(res, false, 500, "Error updating store", error);
    }
};

// Delete a store by ID
exports.deleteStore = async (req, res) => {
    const storeId = req.params.id;

    if (!storeId) {
        return baseResponse(res, false, 400, "Missing store id", null);
    }

    try {
        const store = await storeRepository.deleteStore(storeId);
        if (store) {
            baseResponse(res, true, 200, "Store deleted", store);
        } else {
            baseResponse(res, false, 404, "Store not found", null);
        }
    } catch (error) {
        baseResponse(res, false, 500, "Error deleting store", error);
    }
};

