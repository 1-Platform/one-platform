/**
 * Project model contains all projects in LH
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';
import { ProjectInstance } from '../types';

export const Project = sequelize.define<ProjectInstance>('projects', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING(40) },
  slug: { type: DataTypes.STRING(40) },
  externalUrl: { type: DataTypes.STRING(256) },
  token: { type: DataTypes.UUID },
  baseBranch: { type: DataTypes.STRING(80) },
  adminToken: { type: DataTypes.STRING(64) },
  createdAt: { type: DataTypes.DATE(6) },
  updatedAt: { type: DataTypes.DATE(6) },
});
