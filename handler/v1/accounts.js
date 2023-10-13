const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../../helpers');

module.exports = {
    // create new accounts
    createAccounts: async (req, res, next) => {
        try {
            let { user_id, bank_name, bank_account_number, ballance } = req.body;

            let accounts = await prisma.Bank_Accounts.create({
                data: {
                    user_id,
                    bank_name,
                    bank_account_number,
                    ballance,
                },
            });
            res.status(201).json({
                status: true,
                message: "Create accounts",
                data: accounts,
            })
        } catch (err) {
            next(err);
        }
    },

    //get all accounts
    getAllAccounts: async (req, res, next) => {
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let accounts = await prisma.Bank_Accounts.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            const { _count } = await prisma.Bank_Accounts.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: "OK",
                data: { pagination, accounts }
            });
        } catch (err) {
            next(err);
        }
    },

    //get detail accounts
    getDetailAccounts: async (req, res, next) => {
        try {
            let { id } = req.params;
            let accounts = await prisma.Bank_Accounts.findUnique({ where: { id: Number(id) } });

            if (!accounts) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    data: 'No accounts Found With Id ' + id
                });
            }

            res.status(200).json({
                status: true,
                message: 'Detail accounts',
                data: accounts
            });

        } catch (err) {
            next(err);
        }

    }
}