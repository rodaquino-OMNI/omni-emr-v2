
// Export all role-specific entry point components
export { default as DoctorDashboard } from './DoctorDashboard';
export { default as NurseDashboard } from './NurseDashboard';
export { default as AdminDashboard } from './AdminDashboard';
export { default as PharmacistDashboard } from './PharmacistDashboard';
export { default as DefaultDashboard } from './DefaultDashboard';

// Initialize the component registry with these entrypoints
import { componentRegistry } from '../RoleComponentRegistry';
import { UserRole } from '@/types/auth';
import DoctorDashboard from './DoctorDashboard';
import NurseDashboard from './NurseDashboard';
import AdminDashboard from './AdminDashboard';
import PharmacistDashboard from './PharmacistDashboard';
import DefaultDashboard from './DefaultDashboard';

// Register dashboard components by role
componentRegistry.register('dashboard', DoctorDashboard, ['doctor', 'physician'] as UserRole[], 10);
componentRegistry.register('dashboard', NurseDashboard, ['nurse'] as UserRole[], 10);
componentRegistry.register('dashboard', AdminDashboard, ['admin', 'system_administrator'] as UserRole[], 10);
componentRegistry.register('dashboard', PharmacistDashboard, ['pharmacist'] as UserRole[], 10);
componentRegistry.register('dashboard', DefaultDashboard, ['all'] as UserRole[], 0); // Fallback for all roles
