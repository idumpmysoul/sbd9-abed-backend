// 1. Updated user.controller.js with password hashing and email validation
const userRepository = require('../repositories/user.repository');
const baseResponse = require('../utils/baseResponse.util');
const bcrypt = require('bcrypt');

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Register user with password hashing
exports.registerUser = async (req, res) => {
    const { email, password, name } = req.query;

    if (!email || !password || !name) {
        return baseResponse(res, false, 400, "Missing user email, password or name", null);
    }

    // Validate email format
    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, "Invalid email format", null);
    }

    try {
        // Check if the email already exists
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return baseResponse(res, false, 400, "Email already used", null);
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const newUser = await userRepository.createUser({ email, password: hashedPassword, name });

        baseResponse(res, true, 201, "User created", newUser);
    } catch (error) {
        baseResponse(res, false, 500, "Server Error", error);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.query;

    if (!email || !password) {
        return baseResponse(res, false, 400, "Missing email or password", null);
    }

    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 400, "Invalid email or password", null);
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return baseResponse(res, false, 400, "Invalid email or password", null);
        }

        baseResponse(res, true, 200, "Login successful", user);
    } catch (error) {
        baseResponse(res, false, 500, "Server Error", error);
    }
};

// Update user with password hashing
exports.updateUser = async (req, res) => {
    const { id, email, password, name } = req.body;

    if (!id || !email || !password || !name) {
        return baseResponse(res, false, 400, "Missing user id, email, password, or name", null);
    }

    // Validate email format
    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, "Invalid email format", null);
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedUser = await userRepository.updateUser(id, { 
            email, 
            password: hashedPassword, 
            name 
        });

        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User updated", updatedUser);
    } catch (error) {
        baseResponse(res, false, 500, "Server Error", error);
    }
};

// Other controller methods remain unchanged
exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        baseResponse(res, false, 500, "Server Error", error);
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await userRepository.deleteUser(id);

        if (!deletedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User deleted", deletedUser);
    } catch (error) {
        baseResponse(res, false, 500, "Server Error", error);
    }
};

// Top-up user balance endpoint
exports.topUpUser = async (req, res) => {
    const { id, amount } = req.query;
    
    if (!id || !amount) {
        return baseResponse(res, false, 400, "Missing user id or amount", null);
    }
    
    const amountNum = parseInt(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
        return baseResponse(res, false, 400, "Amount must be larger than 0", null);
    }
    
    try {
        // Get current user
        const user = await userRepository.getUserById(id);
        
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        
        // Update balance
        const newBalance = (user.balance || 0) + amountNum;
        const updatedUser = await userRepository.updateBalance(id, newBalance);
        
        if (!updatedUser) {
            return baseResponse(res, false, 500, "Failed to update balance", null);
        }
        
        baseResponse(res, true, 200, "Top up successful", updatedUser);
    } catch (error) {
        baseResponse(res, false, 500, "Server Error", error);
    }
};
