import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class PlanFeature extends Model {
  public id!: number;
  public plan_id!: number;
  public feature_id!: number;
  public feature_limit!: number;
  public is_unlimited!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PlanFeature.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id',
      },
    },
    feature_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'features',
        key: 'id',
      },
    },
    feature_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_unlimited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'PlanFeature',
    tableName: 'plan_features',
    indexes: [
      {
        unique: true,
        fields: ['plan_id', 'feature_id'],
      },
    ],
  }
);