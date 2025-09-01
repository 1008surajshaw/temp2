import { User } from './User';
import { Organization } from './Organization';
import { Plan } from './Plan';
import { Feature } from './Feature';
import { PlanFeature } from './PlanFeature';
import { UserSubscription } from './UserSubscription';
import { Usage } from './Usage';

Organization.hasMany(User, { foreignKey: 'organization_id', as: 'users' });
Organization.hasMany(Feature, { foreignKey: 'organization_id', as: 'features' });
Organization.hasMany(Plan, { foreignKey: 'organization_id', as: 'plans' });

User.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });
User.hasMany(UserSubscription, { foreignKey: 'user_id', as: 'subscriptions' });
User.hasMany(Usage, { foreignKey: 'user_id', as: 'usage' });

Feature.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });
Feature.hasMany(PlanFeature, { foreignKey: 'feature_id', as: 'planFeatures' });
Feature.hasMany(Usage, { foreignKey: 'feature_id', as: 'usage' });

Plan.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });
Plan.hasMany(PlanFeature, { foreignKey: 'plan_id', as: 'planFeatures' });
Plan.hasMany(UserSubscription, { foreignKey: 'plan_id', as: 'subscriptions' });

Plan.belongsToMany(Feature, { 
  through: PlanFeature, 
  foreignKey: 'plan_id', 
  otherKey: 'feature_id',
  as: 'features' 
});
Feature.belongsToMany(Plan, { 
  through: PlanFeature, 
  foreignKey: 'feature_id', 
  otherKey: 'plan_id',
  as: 'plans' 
});

PlanFeature.belongsTo(Plan, { foreignKey: 'plan_id', as: 'plan' });
PlanFeature.belongsTo(Feature, { foreignKey: 'feature_id', as: 'feature' });

UserSubscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserSubscription.belongsTo(Plan, { foreignKey: 'plan_id', as: 'plan' });

Usage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Usage.belongsTo(Feature, { foreignKey: 'feature_id', as: 'feature' });

export {
  User,
  Organization,
  Plan,
  Feature,
  PlanFeature,
  UserSubscription,
  Usage,
};