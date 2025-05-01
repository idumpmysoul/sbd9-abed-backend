const express = require("express");
require("dotenv").config();
const path = require('path');
const fs = require('fs');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS implementation
const corsOptions = {
  origin: "https://os.netlabdte.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const userRoutes = require('./src/routes/user.route');
const storeRouter = require('./src/routes/store.route');
const itemRouter = require('./src/routes/item.route');
const transactionRouter = require('./src/routes/transaction.route');

app.use('/user', userRoutes);
app.use('/store', storeRouter);
app.use('/item', itemRouter);
app.use('/transaction', transactionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
