// src/routes/item.route.js
const express = require("express");
const router = express.Router();
const itemController = require("../controller/item.controller");
const upload = require("../utils/multer.util");

// Create new item with image upload
router.post("/create", upload.single("image"), itemController.createItem);

// src/routes/item.route.js
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db.query("SELECT COUNT(*) FROM items");
    const total = parseInt(countResult.rows[0].count);

    // Get paginated items
    const itemsResult = await db.query(
      "SELECT * FROM items ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    res.json({
      success: true,
      items: itemsResult.rows,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get item by ID
router.get("/byId/:id", itemController.getItemById);

// Get items by store ID
router.get("/byStoreId/:store_id", itemController.getItemsByStoreId);

// Update item with optional image upload
router.put("/", upload.single("image"), itemController.updateItem);

// Delete item
router.delete("/:id", itemController.deleteItem);

module.exports = router;
