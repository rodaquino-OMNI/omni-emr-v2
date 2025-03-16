
// Export all role-specific entry point components
export { default as DoctorDashboard } from './DoctorDashboard';
export { default as NurseDashboard } from './NurseDashboard';
export { default as AdminDashboard } from './AdminDashboard';
export { default as PharmacistDashboard } from './PharmacistDashboard';
export { default as DefaultDashboard } from './DefaultDashboard';

// Initialize the component registry with these entrypoints
import { componentRegistry } from '../RoleComponentRegistry';
import DoctorDashboard from './DoctorDashboard';
import NurseDashboard from './NurseDashboard';
import AdminDashboard from './AdminDashboard';
import PharmacistDashboard from './PharmacistDashboard';
import DefaultDashboard from './DefaultDashboard';

// Register dashboard components by role
componentRegistry.register('dashboard', DoctorDashboard, ['doctor', 'physician'], 10);
componentRegistry.register('dashboard', NurseDashboard, ['nurse'], 10);
componentRegistry.register('dashboard', AdminDashboard, ['admin', 'system_administrator'], 10);
componentRegistry.register('dashboard', PharmacistDashboard, ['pharmacist'], 10);
componentRegistry.register('dashboard', DefaultDashboard, ['all'], 0); // Fallback for all roles
