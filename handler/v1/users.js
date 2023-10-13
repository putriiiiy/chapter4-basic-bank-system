const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../../helpers');

module.exports = {
    // create new users
    createUsers: async (req, res, next) => {
        try {
          let { name, email, password, profile } = req.body;
          console.log(req.body); // Mencetak seluruh req.body ke konsol
          let users = await prisma.users.create({
            data: {
              name,
              email,
              password,
              profile: {
                create: profile,
              },
            },
          });
          res.status(201).json({
            status: true,
            message: "Created users",
            data: users,
          });
        } catch (err) {
          next(err);
        }
      },
      
    //get all users
    getAllUsers: async (req, res, next) => {
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let users = await prisma.users.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            const { _count } = await prisma.users.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: 'OK',
                data: { pagination, users }
            });
        } catch (err) {
            next(err);
        }
    },

    // get user detail
    getDetailUsers: async (req, res, next) => {
        try {
            let { id } = req.params;
            let users = await prisma.users.findUnique({ where: {id: Number(id)}});

            if (!users) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    data: 'No Users Found With Id ' + id
                });
            }

            res.status(200).json({
                status: true,
                message: 'OK',
                data: users
            });
        } catch (err) {
            next(err);
        }
    },

};