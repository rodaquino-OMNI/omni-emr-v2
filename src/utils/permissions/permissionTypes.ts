
// Define permission categories for organizational purposes
export const permissionCategories: Record<string, string[]> = {
  patients: [
    'patients:read',
    'patients:write',
    'patients:delete',
    'patients:view',
    'patients:view:specialty'
  ],
  medications: [
    'medications:read',
    'medications:write',
    'medications:delete',
    'medications:view',
    'medications:prescribe',
    'medications:administer'
  ],
  notes: [
    'notes:read',
    'notes:write',
    'notes:view',
    'notes:delete'
  ],
  admin: [
    'admin:access',
    'admin:users',
    'admin:settings',
    'admin:reports'
  ],
  dashboard: [
    'dashboard:view',
    'dashboard:stats'
  ]
};

// Define shared permissions all authenticated users have
export const sharedPermissions = [
  'profile:read',
  'profile:update',
  'notifications:read'
];

// Create a flat array of all possible permissions
export const allPermissions = [
  ...sharedPermissions,
  ...Object.values(permissionCategories).flat()
];
