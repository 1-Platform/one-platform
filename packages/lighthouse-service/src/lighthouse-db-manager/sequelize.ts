import { Sequelize } from 'sequelize';

const LH_DATABASE_URI = `postgres://${process.env.LH_DB_USER}:${process.env.LH_DB_PASSWORD}@${process.env.LH_DB_URL}/${process.env.LH_DB_NAME}`;

export const sequelize = new Sequelize(LH_DATABASE_URI);
