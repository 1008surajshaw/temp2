import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class Usage extends Model {
  public id!: number;
  public user_id!: number;
  public feature_id!: number;
  public usage_count!: number;
  public usage_limit!: number;
  public period!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Usage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Usage',
    tableName: 'usage',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'feature_id', 'period'],
      },
    ],
  }
);