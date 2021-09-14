/**
 * Statistic model contains information like
 * SEO, PWA, Acessibility of a project and its build
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';
import { StatisticInstance } from '../types';

const ModelRef = undefined;

export const Statistic = sequelize.define<StatisticInstance>('statistics', {
  id: { type: DataTypes.UUID, primaryKey: true },
  projectId: {
    type: DataTypes.UUID,
    references: { model: ModelRef, key: 'id' },
  },
  buildId: {
    type: DataTypes.UUID,
    references: { model: ModelRef, key: 'id' },
  },
  version: { type: DataTypes.DECIMAL(8, 2) },
  url: { type: DataTypes.STRING({ length: 256 }) },
  name: { type: DataTypes.STRING({ length: 100 }) },
  value: { type: DataTypes.DECIMAL(12, 4) },
  createdAt: { type: DataTypes.DATE(6) },
  updatedAt: { type: DataTypes.DATE(6) },
});
