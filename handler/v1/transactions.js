const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../../helpers');

module.exports = {
    //create new transactions
    createTransactions: async (req, res, next) => {
        try {
            let { source_account_id, destination_account_id, amount } = req.body;
        
            let source_account = await prisma.Bank_Accounts.findUnique({where: { id: source_account_id}});
    
            let destination_account = await prisma.Bank_Accounts.findUnique({where: {id: destination_account_id}});
    
            if (!source_account || !destination_account) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid source or destination account",
                    data: null,
                });
            }
    
            if (source_account.ballance < amount) {
                return res.status(400).json({
                    status: false,
                    message: "Low ballance in the source account",
                    data: null,
                });
            }
    
            let createTransaction = await prisma.Transactions.create({
                data: {
                    source_account_id,
                    destination_account_id,
                    amount,
                },
            });
    
            
            await prisma.Bank_Accounts.update({where: {id: source_account_id},
                data: {
                    ballance: {
                        decrement: amount,
                    },
                },
            });
    
            await prisma.Bank_Accounts.update({where: {id: destination_account_id},
                data: {
                    ballance: {
                        increment: amount,
                    },
                },
            });
    
            res.status(200).json({
                status: true,
                message: "Transactions success",
                data: createTransaction,
            });
        } catch (err) {
            next(err);
        }
    },

    //get all transactions
    getAllTransactions: async (req, res, next) => {
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let transactions = await prisma.transactions.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            const { _count } = await prisma.transactions.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: "Ok",
                data: { pagination, transactions }
            });

        } catch (err) {
            next(err);
        }
    },

    //get detail transactions
    getDetailTransactions: async (req, res, next) => {
        try {
            const { id } = req.params;

            const detailTransaction = await prisma.transactions.findUnique({where: {id: Number(id)},
                include: {
                    source_account: {
                        include: {
                            user: true,
                        },
                    },
                    destination_account: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            if (!detailTransaction) {
                return res.status(404).json({
                    status: false,
                    message: "data tidak ditemukan",
                    data: null,
                });
            }

            res.status(200).json({
                status: true,
                message: "Ok",
                data: detailTransaction,
            });
        } catch (err) {
            next(err);
        }
    },



};