
// This file is now a simple re-export to maintain backward compatibility
// The actual implementation has been split into smaller files

export { 
  permissionCategories,
  sharedPermissions,
  allPermissions 
} from './permissions/permissionTypes';

export { rolePermissions } from './permissions/roleDefinitions';
