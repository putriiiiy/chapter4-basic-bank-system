const express = require('express');
const router = express.Router();
const { createUsers,getAllUsers, getDetailUsers} = require('../handler/v1/users');
const { createAccounts, getAllAccounts, getDetailAccounts} = require('../handler/v1/accounts');
const { createTransactions, getAllTransactions, getDetailTransactions} = require('../handler/v1/transactions');

router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'BANK SYSTEM',
        data: null
    });
});

//users
router.post("/users", createUsers);
router.get("/users", getAllUsers);
router.get("/users/:id", getDetailUsers);

//accounts
router.post("/accounts", createAccounts);
router.get("/accounts", getAllAccounts);
router.get("/accounts/:id", getDetailAccounts);

//transactions
router.post("/transactions", createTransactions);
router.get("/transactions", getAllTransactions);
router.get("/transactions/:id", getDetailTransactions);



module.exports =router;