
import React from 'react';
import { UserRole } from '@/types/auth';

// Interface for registered components
export interface RegisteredComponent {
  component: React.ComponentType<any>;
  roles: UserRole[];
  priority: number;
}

// Registry to store components by type
class ComponentRegistry {
  private components: Map<string, RegisteredComponent[]> = new Map();

  // Register a component for specific roles
  register(
    type: string,
    component: React.ComponentType<any>, 
    roles: UserRole[], 
    priority: number = 0
  ) {
    if (!this.components.has(type)) {
      this.components.set(type, []);
    }
    
    this.components.get(type)?.push({
      component,
      roles,
      priority
    });
    
    // Sort by priority (higher numbers first)
    this.components.get(type)?.sort((a, b) => b.priority - a.priority);
  }
  
  // Get component for a specific role and type
  getComponent(type: string, role: UserRole): React.ComponentType<any> | null {
    const componentsForType = this.components.get(type) || [];
    
    // Find the highest priority component that matches the role
    const match = componentsForType.find(item => 
      item.roles.includes(role) || item.roles.includes('all' as UserRole)
    );
    
    return match ? match.component : null;
  }
  
  // Get all components for a specific type that match the role
  getAllComponents(type: string, role: UserRole): React.ComponentType<any>[] {
    const componentsForType = this.components.get(type) || [];
    
    // Filter components that match the role
    return componentsForType
      .filter(item => 
        item.roles.includes(role) || item.roles.includes('all' as UserRole)
      )
      .map(item => item.component);
  }
}

// Create and export a singleton instance
export const componentRegistry = new ComponentRegistry();
