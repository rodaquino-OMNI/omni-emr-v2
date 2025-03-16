
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AuditLogDetail from '../AuditLogDetail';
import { AuditLogEntry } from '../hooks/useAuditLogsData';
import { describe, it, expect } from 'vitest';

// Sample log data
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
  },
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

// Sample user mapping
const userMap = {
  'user1': 'John Doe'
};

describe('AuditLogDetail', () => {
  it('renders log details correctly', () => {
    render(
      <AuditLogDetail 
        log={sampleLog}
        onClose={vi.fn()}
        userMap={userMap}
      />
    );

    // Check header
    expect(screen.getByText('Log Details')).toBeInTheDocument();
    
    // Check user info
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(`User ID: ${sampleLog.user_id}`)).toBeInTheDocument();
    
    // Check action info
    expect(screen.getByText('Update Action')).toBeInTheDocument();
    expect(screen.getByText('medication')).toBeInTheDocument();
    expect(screen.getByText(`Resource ID: ${sampleLog.resource_id}`)).toBeInTheDocument();
    
    // Check IP address
    expect(screen.getByText('IP Address')).toBeInTheDocument();
    expect(screen.getByText(sampleLog.ip_address)).toBeInTheDocument();
    
    // Check technical details - should include stringified details
    const detailsText = JSON.stringify(sampleLog.details, null, 2);
    expect(screen.getByText(detailsText)).toBeInTheDocument();
    
    // Check security risk level
    expect(screen.getByText('Security risk level')).toBeInTheDocument();
    // Update action should be medium risk
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = vi.fn();
    
    render(
      <AuditLogDetail 
        log={sampleLog}
        onClose={onCloseMock}
        userMap={userMap}
      />
    );

    // Find the close button and click it
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('handles different action types and security levels', () => {
    // Test with a delete action (high risk)
    const deleteLog = { ...sampleLog, action: 'delete' };
    const { rerender } = render(
      <AuditLogDetail 
        log={deleteLog}
        onClose={vi.fn()}
        userMap={userMap}
      />
    );
    
    expect(screen.getByText('Delete Action')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    
    // Test with a view action (low risk)
    const viewLog = { ...sampleLog, action: 'view' };
    rerender(
      <AuditLogDetail 
        log={viewLog}
        onClose={vi.fn()}
        userMap={userMap}
      />
    );
    
    expect(screen.getByText('View Action')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
  });

  it('handles missing or unavailable data gracefully', () => {
    // Create a log with some missing fields
    const incompleteLog = { 
      ...sampleLog,
      ip_address: undefined,
      user_agent: undefined,
      details: null
    };
    
    render(
      <AuditLogDetail 
        log={incompleteLog}
        onClose={vi.fn()}
        userMap={userMap}
      />
    );
    
    // Check that the component handles missing IP address
    expect(screen.getByText('Not available')).toBeInTheDocument();
    
    // Should still render other available data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(`User ID: ${sampleLog.user_id}`)).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    render(
      <AuditLogDetail 
        log={sampleLog}
        onClose={vi.fn()}
        userMap={userMap}
      />
    );
    
    // Check timestamp formatting (will depend on locale/timezone)
    // We'll just make sure it contains some parts of the date
    const timestamp = new Date(sampleLog.timestamp).toLocaleString();
    const [datePart] = timestamp.split(',');
    expect(screen.getByText(/Timestamp/)).toBeInTheDocument();
    
    // The exact format might vary by environment, but should contain parts of the date
    const timestampElements = screen.getAllByText((content) => {
      return content.includes(datePart.trim());
    });
    expect(timestampElements.length).toBeGreaterThan(0);
  });

  it('handles unknown users gracefully', () => {
    // Test with a user not in userMap
    const unknownUserLog = { ...sampleLog, user_id: 'unknown123' };
    
    render(
      <AuditLogDetail 
        log={unknownUserLog}
        onClose={vi.fn()}
        userMap={userMap}
      />
    );
    
    // Should show abbreviated user id when name not found
    expect(screen.getByText(/User unknown12.../)).toBeInTheDocument();
  });
});
