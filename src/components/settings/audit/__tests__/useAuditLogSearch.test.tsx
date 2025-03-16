
import { renderHook, act } from '@testing-library/react';
import { useAuditLogSearch } from '../hooks/useAuditLogSearch';
import { AuditLogEntry } from '../hooks/useAuditLogsData';
import { describe, it, expect } from 'vitest';

// Sample logs
const sampleLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: '2023-07-01T12:00:00Z',
    user_id: 'user1',
    action: 'login',
    resource_type: 'system',
    resource_id: 'sys1',
    details: { browser: 'Chrome', device: 'Desktop' },
  },
  {
    id: '2',
    timestamp: '2023-07-02T14:30:00Z',
    user_id: 'user2',
    action: 'view',
    resource_type: 'patient',
    resource_id: 'pat1',
    details: { pageViewed: 'medical-history' },
  },
  {
    id: '3',
    timestamp: '2023-07-03T09:15:00Z',
    user_id: 'user1',
    action: 'update',
    resource_type: 'medication',
    resource_id: 'med1',
    details: { changedFields: ['dosage', 'frequency'] },
  }
];

// Sample user mapping
const userMap = {
  'user1': 'John Doe',
  'user2': 'Jane Smith'
};

describe('useAuditLogSearch', () => {
  it('returns all logs when search term is empty', () => {
    const { result } = renderHook(() => useAuditLogSearch(sampleLogs, userMap));
    
    expect(result.current.searchTerm).toBe('');
    expect(result.current.searchedLogs).toEqual(sampleLogs);
    expect(result.current.isFiltered).toBe(false);
  });

  it('filters logs by action', () => {
    const { result } = renderHook(() => useAuditLogSearch(sampleLogs, userMap));
    
    act(() => {
      result.current.setSearchTerm('login');
    });
    
    expect(result.current.searchTerm).toBe('login');
    expect(result.current.searchedLogs.length).toBe(1);
    expect(result.current.searchedLogs[0].id).toBe('1');
    expect(result.current.isFiltered).toBe(true);
  });

  it('filters logs by resource type', () => {
    const { result } = renderHook(() => useAuditLogSearch(sampleLogs, userMap));
    
    act(() => {
      result.current.setSearchTerm('patient');
    });
    
    expect(result.current.searchTerm).toBe('patient');
    expect(result.current.searchedLogs.length).toBe(1);
    expect(result.current.searchedLogs[0].id).toBe('2');
    expect(result.current.isFiltered).toBe(true);
  });

  it('filters logs by user name from userMap', () => {
    const { result } = renderHook(() => useAuditLogSearch(sampleLogs, userMap));
    
    act(() => {
      result.current.setSearchTerm('Jane');
    });
    
    expect(result.current.searchTerm).toBe('Jane');
    expect(result.current.searchedLogs.length).toBe(1);
    expect(result.current.searchedLogs[0].id).toBe('2');
    expect(result.current.isFiltered).toBe(true);
  });

  it('filters logs by details content', () => {
    const { result } = renderHook(() => useAuditLogSearch(sampleLogs, userMap));
    
    act(() => {
      result.current.setSearchTerm('Chrome');
    });
    
    expect(result.current.searchTerm).toBe('Chrome');
    expect(result.current.searchedLogs.length).toBe(1);
    expect(result.current.searchedLogs[0].id).toBe('1');
    expect(result.current.isFiltered).toBe(true);
  });

  it('handles case-insensitive searches', () => {
    const { result } = renderHook(() => useAuditLogSearch(sampleLogs, userMap));
    
    act(() => {
      result.current.setSearchTerm('MEDICATION');
    });
    
    expect(result.current.searchTerm).toBe('MEDICATION');
    expect(result.current.searchedLogs.length).toBe(1);
    expect(result.current.searchedLogs[0].id).toBe('3');
    expect(result.current.isFiltered).toBe(true);
  });

  it('filters correctly with partial matches', () => {
    const { result } = renderHook(() => useAuditLogSearch(sampleLogs, userMap));
    
    act(() => {
      result.current.setSearchTerm('med');
    });
    
    // Should match both "medication" resource_type and "medical-history" in details
    expect(result.current.searchTerm).toBe('med');
    expect(result.current.searchedLogs.length).toBe(2);
    expect(result.current.searchedLogs.map(log => log.id)).toContain('2');
    expect(result.current.searchedLogs.map(log => log.id)).toContain('3');
    expect(result.current.isFiltered).toBe(true);
  });

  it('returns no results for non-matching search terms', () => {
    const { result } = renderHook(() => useAuditLogSearch(sampleLogs, userMap));
    
    act(() => {
      result.current.setSearchTerm('nonexistent');
    });
    
    expect(result.current.searchTerm).toBe('nonexistent');
    expect(result.current.searchedLogs.length).toBe(0);
    expect(result.current.isFiltered).toBe(true);
  });

  it('handles empty logs array', () => {
    const { result } = renderHook(() => useAuditLogSearch([], userMap));
    
    expect(result.current.searchTerm).toBe('');
    expect(result.current.searchedLogs).toEqual([]);
    expect(result.current.isFiltered).toBe(false);
    
    act(() => {
      result.current.setSearchTerm('test');
    });
    
    expect(result.current.searchTerm).toBe('test');
    expect(result.current.searchedLogs).toEqual([]);
    expect(result.current.isFiltered).toBe(true);
  });
});
