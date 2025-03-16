
import { renderHook, act } from '@testing-library/react';
import { useLogDetailView } from '../hooks/useLogDetailView';
import { AuditLogEntry } from '../hooks/useAuditLogsData';
import { describe, it, expect } from 'vitest';

// Sample log entry
const sampleLog: AuditLogEntry = {
  id: 'log123',
  timestamp: '2023-07-01T12:00:00Z',
  user_id: 'user1',
  action: 'update',
  resource_type: 'medication',
  resource_id: 'med456',
  details: { 
    previous: { dosage: '5mg', frequency: 'daily' },
    new: { dosage: '10mg', frequency: 'twice daily' }
  }
};

describe('useLogDetailView', () => {
  it('starts with null selected log and closed detail panel', () => {
    const { result } = renderHook(() => useLogDetailView());
    
    expect(result.current.selectedLog).toBeNull();
    expect(result.current.detailOpen).toBe(false);
  });

  it('sets selected log and opens detail panel when viewing details', () => {
    const { result } = renderHook(() => useLogDetailView());
    
    act(() => {
      result.current.handleViewDetails(sampleLog);
    });
    
    expect(result.current.selectedLog).toEqual(sampleLog);
    expect(result.current.detailOpen).toBe(true);
  });

  it('keeps selected log but closes detail panel when closing details', () => {
    const { result } = renderHook(() => useLogDetailView());
    
    // First, set a selected log and open details
    act(() => {
      result.current.handleViewDetails(sampleLog);
    });
    
    expect(result.current.selectedLog).toEqual(sampleLog);
    expect(result.current.detailOpen).toBe(true);
    
    // Now close the details
    act(() => {
      result.current.handleCloseDetails();
    });
    
    // Selected log should still be set, but detail panel should be closed
    expect(result.current.selectedLog).toEqual(sampleLog);
    expect(result.current.detailOpen).toBe(false);
  });

  it('allows directly setting detail panel open state', () => {
    const { result } = renderHook(() => useLogDetailView());
    
    // First set a log so we have something to view
    act(() => {
      result.current.handleViewDetails(sampleLog);
    });
    
    // Then close via setDetailOpen
    act(() => {
      result.current.setDetailOpen(false);
    });
    
    expect(result.current.detailOpen).toBe(false);
    
    // Reopen via setDetailOpen
    act(() => {
      result.current.setDetailOpen(true);
    });
    
    expect(result.current.detailOpen).toBe(true);
  });

  it('handles selecting a different log', () => {
    const { result } = renderHook(() => useLogDetailView());
    
    // First log
    act(() => {
      result.current.handleViewDetails(sampleLog);
    });
    
    expect(result.current.selectedLog).toEqual(sampleLog);
    
    // Second log with different details
    const secondLog: AuditLogEntry = {
      ...sampleLog,
      id: 'log456',
      action: 'delete',
      resource_type: 'patient'
    };
    
    act(() => {
      result.current.handleViewDetails(secondLog);
    });
    
    // Should update to new log
    expect(result.current.selectedLog).toEqual(secondLog);
    expect(result.current.selectedLog?.id).toBe('log456');
    expect(result.current.detailOpen).toBe(true);
  });
});
