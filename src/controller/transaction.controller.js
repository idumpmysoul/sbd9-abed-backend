const transactionRepository = require('../repositories/transaction.repository');
const userRepository = require('../repositories/user.repository');
const itemRepository = require('../repositories/item.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.createTransaction = async (req, res) => {
    const { item_id, quantity, user_id } = req.body;
    
    if (!item_id || !quantity || !user_id) {
        return baseResponse(res, false, 400, "Missing item_id, quantity, or user_id", null);
    }
    
    if (quantity <= 0) {
        return baseResponse(res, false, 400, "Quantity must be larger than 0", null);
    }
    
    try {
        // Get item details
        const item = await itemRepository.getItemById(item_id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        
        // Check stock
        if (item.stock < quantity) {
            return baseResponse(res, false, 400, "Not enough stock available", null);
        }
        
        // Calculate total
        const total = item.price * quantity;
        
        // Create transaction
        const transaction = await transactionRepository.createTransaction({
            user_id,
            item_id,
            quantity,
            total
        });
        
        baseResponse(res, true, 201, "Transaction created", transaction);
    } catch (error) {
        baseResponse(res, false, 500, "Server Error", error);
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
        
        // Update item stock
        const item = await itemRepository.getItemById(transaction.item_id);
        const newStock = item.stock - transaction.quantity;
        await itemRepository.updateItemStock(item.id, newStock);
        
        baseResponse(res, true, 200, "Payment successful", updatedTransaction);
    } catch (error) {
        baseResponse(res, false, 500, "Failed to pay", error);
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedTransaction = await transactionRepository.deleteTransaction(id);
        
        if (!deletedTransaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        
        baseResponse(res, true, 200, "Transaction deleted", deletedTransaction);
    } catch (error) {
        baseResponse(res, false, 500, "Server Error", error);
    }
};

