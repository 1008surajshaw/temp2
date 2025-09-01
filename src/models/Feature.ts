import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class Feature extends Model {
  public id!: number;
  public organization_id!: number;
  public name!: string;
  public feature_key!: string;
  public description!: string;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Feature.init(
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
    feature_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Feature',
    tableName: 'features',
    indexes: [
      {
        unique: true,
        fields: ['organization_id', 'feature_key'],
      },
    ],
  }
);