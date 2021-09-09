/**
 * Build model contains information of each builds executed in LH server
 */

import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';
import { BuildInstance } from '../types';

const ModelRef = undefined;

export const Build = sequelize.define<BuildInstance>('builds', {
  id: { type: DataTypes.UUID, primaryKey: true },
  projectId: {
    type: DataTypes.UUID,
    references: { model: ModelRef, key: 'id' },
  },
  lifecycle: { type: DataTypes.STRING(40) },
  hash: { type: DataTypes.STRING(40) },
  branch: { type: DataTypes.STRING(40) },
  commitMessage: { type: DataTypes.STRING(80) },
  author: { type: DataTypes.STRING(256) },
  avatarUrl: { type: DataTypes.STRING(256) },
  ancestorHash: { type: DataTypes.STRING(40) },
  externalBuildUrl: { type: DataTypes.STRING(256) },
  runAt: { type: DataTypes.DATE(6) }, // should mostly be equal to createdAt but modifiable by the consumer
  committedAt: { type: DataTypes.DATE(6) },
  ancestorCommittedAt: { type: DataTypes.DATE(6) },
  createdAt: { type: DataTypes.DATE(6) },
  updatedAt: { type: DataTypes.DATE(6) },
});
