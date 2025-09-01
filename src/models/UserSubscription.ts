import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class UserSubscription extends Model {
  public id!: number;
  public user_id!: number;
  public plan_id!: number;
  public status!: 'active' | 'inactive' | 'cancelled' | 'expired';
  public start_date!: Date;
  public end_date!: Date;
  public auto_renew!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserSubscription.init(
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
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'cancelled', 'expired'),
      defaultValue: 'active',
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'UserSubscription',
    tableName: 'user_subscriptions',
  }
);