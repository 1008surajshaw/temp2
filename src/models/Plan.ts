import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class Plan extends Model {
  public id!: number;
  public organization_id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public billing_cycle!: 'monthly' | 'yearly';
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Plan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    billing_cycle: {
      type: DataTypes.ENUM('monthly', 'yearly'),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Plan',
    tableName: 'plans',
  }
);