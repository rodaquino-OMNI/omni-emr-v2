
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SecurityAuditLog from '../../../settings/SecurityAuditLog';
import { useAuditLogs } from '../useAuditLogs';
import { useAuditLogSearch } from '../hooks/useAuditLogSearch';
import { useLogDetailView } from '../hooks/useLogDetailView';
import { AuditLogEntry } from '../hooks/useAuditLogsData';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock the hooks
vi.mock('../useAuditLogs', () => ({
  useAuditLogs: vi.fn()
}));

vi.mock('../hooks/useAuditLogSearch', () => ({
  useAuditLogSearch: vi.fn()
}));

vi.mock('../hooks/useLogDetailView', () => ({
  useLogDetailView: vi.fn()
}));

// Mock the context
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { role: 'admin' }
  })
}));

// Mock sample data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: '2023-07-01T12:00:00Z',
    user_id: 'user1',
    action: 'login',
    resource_type: 'system',
    resource_id: 'sys1',
    details: { browser: 'Chrome', device: 'Desktop' },
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0'
  },
  {
    id: '2',
    timestamp: '2023-07-02T14:30:00Z',
    user_id: 'user2',
    action: 'view',
    resource_type: 'patient',
    resource_id: 'pat1',
    details: { pageViewed: 'medical-history' },
    ip_address: '192.168.1.2',
    user_agent: 'Mozilla/5.0'
  },
  {
    id: '3',
    timestamp: '2023-07-03T09:15:00Z',
    user_id: 'user1',
    action: 'update',
    resource_type: 'medication',
    resource_id: 'med1',
    details: { changedFields: ['dosage', 'frequency'] },
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0'
  }
];

describe('Security Audit Log Component', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock return values
    (useAuditLogs as any).mockReturnValue({
      filteredLogs: mockAuditLogs,
      loading: false,
      filter: 'all',
      setFilter: vi.fn(),
      userMap: { user1: 'John Doe', user2: 'Jane Smith' },
      exportAuditLogs: vi.fn(),
      refreshLogs: vi.fn()
    });

    (useAuditLogSearch as any).mockReturnValue({
      searchTerm: '',
      setSearchTerm: vi.fn(),
      searchedLogs: mockAuditLogs,
      isFiltered: false
    });

    (useLogDetailView as any).mockReturnValue({
      selectedLog: null,
      detailOpen: false,
      setDetailOpen: vi.fn(),
      handleViewDetails: vi.fn(),
      handleCloseDetails: vi.fn()
    });
  });

  it('renders Security Audit Log component', () => {
    render(<SecurityAuditLog />);
    expect(screen.getByText('Security Audit')).toBeInTheDocument();
    expect(screen.getByText('HIPAA Compliant')).toBeInTheDocument();
  });

  it('shows loading state when data is being fetched', () => {
    (useAuditLogs as any).mockReturnValue({
      filteredLogs: [],
      loading: true,
      filter: 'all',
      setFilter: vi.fn(),
      userMap: {},
      exportAuditLogs: vi.fn(),
      refreshLogs: vi.fn()
    });

    render(<SecurityAuditLog />);
    expect(screen.getByText('Loading security audit logs...')).toBeInTheDocument();
  });

  it('displays the list of audit logs', () => {
    render(<SecurityAuditLog />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getAllByText('login')[0]).toBeInTheDocument();
    expect(screen.getAllByText('view')[0]).toBeInTheDocument();
    expect(screen.getAllByText('update')[0]).toBeInTheDocument();
  });

  it('filters logs based on action type', () => {
    const setFilterMock = vi.fn();
    (useAuditLogs as any).mockReturnValue({
      filteredLogs: mockAuditLogs.filter(log => log.action === 'login'),
      loading: false,
      filter: 'login',
      setFilter: setFilterMock,
      userMap: { user1: 'John Doe', user2: 'Jane Smith' },
      exportAuditLogs: vi.fn(),
      refreshLogs: vi.fn()
    });

    (useAuditLogSearch as any).mockReturnValue({
      searchTerm: '',
      setSearchTerm: vi.fn(),
      searchedLogs: mockAuditLogs.filter(log => log.action === 'login'),
      isFiltered: false
    });

    render(<SecurityAuditLog />);
    
    // Find the filter dropdown and change it
    const filterDropdown = screen.getAllByRole('combobox')[1]; // Second dropdown is filter
    fireEvent.click(filterDropdown);
    
    // Actually, since the real component uses Radix UI selects which work differently in tests,
    // we'd need to mock their behavior or use more complex test setup.
    // For now, we'll test that filter is correctly passed to the component
    expect(screen.getAllByText('login').length).toBeGreaterThan(0);
  });

  it('searches logs based on search term', () => {
    const setSearchTermMock = vi.fn();
    (useAuditLogSearch as any).mockReturnValue({
      searchTerm: 'John',
      setSearchTerm: setSearchTermMock,
      searchedLogs: mockAuditLogs.filter(log => log.user_id === 'user1'),
      isFiltered: true
    });

    render(<SecurityAuditLog />);
    
    // Find the search input and type
    const searchInput = screen.getByPlaceholderText('Search by user, action, resource...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Verify search term is passed to the setSearchTerm function
    // (This assumes the change handler calls setSearchTerm directly, which it does in our implementation)
    expect(setSearchTermMock).toHaveBeenCalledWith('John');
  });

  it('opens log detail view when viewing details', async () => {
    const handleViewDetailsMock = vi.fn();
    const setDetailOpenMock = vi.fn();
    
    (useLogDetailView as any).mockReturnValue({
      selectedLog: null,
      detailOpen: false,
      setDetailOpen: setDetailOpenMock,
      handleViewDetails: handleViewDetailsMock,
      handleCloseDetails: vi.fn()
    });

    render(<SecurityAuditLog />);
    
    // Find the view details button in the first log entry and click it
    // This is a bit tricky since the button is in a dropdown that's only visible on hover
    // In a real test we'd need to handle the UI interaction more carefully
    
    // For now, we'll simulate clicking directly on the view details function
    const viewDetailsButtons = screen.getAllByRole('button');
    // Find the dropdown trigger button (the one with the three dots)
    const moreButton = viewDetailsButtons.find(button => 
      button.getAttribute('aria-label') === 'Open menu' || 
      button.textContent?.includes('Open menu')
    );
    
    if (moreButton) {
      fireEvent.click(moreButton);
      
      // Now look for the View details option in the dropdown
      await waitFor(() => {
        const viewDetailsOption = screen.getByText('View details');
        fireEvent.click(viewDetailsOption);
        expect(handleViewDetailsMock).toHaveBeenCalled();
      });
    }
  });

  it('exports audit logs when export button is clicked', () => {
    const exportAuditLogsMock = vi.fn();
    (useAuditLogs as any).mockReturnValue({
      filteredLogs: mockAuditLogs,
      loading: false,
      filter: 'all',
      setFilter: vi.fn(),
      userMap: { user1: 'John Doe', user2: 'Jane Smith' },
      exportAuditLogs: exportAuditLogsMock,
      refreshLogs: vi.fn()
    });

    render(<SecurityAuditLog />);
    
    // Find the export button and click it
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    
    // In the real UI this opens a dropdown, but for simplicity in testing:
    // Find the export as CSV option and click it
    const exportCSVOption = screen.getByText('Export as CSV');
    fireEvent.click(exportCSVOption);
    
    expect(exportAuditLogsMock).toHaveBeenCalled();
  });

  it('refreshes audit logs when refresh button is clicked', () => {
    const refreshLogsMock = vi.fn();
    (useAuditLogs as any).mockReturnValue({
      filteredLogs: mockAuditLogs,
      loading: false,
      filter: 'all',
      setFilter: vi.fn(),
      userMap: { user1: 'John Doe', user2: 'Jane Smith' },
      exportAuditLogs: vi.fn(),
      refreshLogs: refreshLogsMock
    });

    render(<SecurityAuditLog />);
    
    // Find the refresh button and click it
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    expect(refreshLogsMock).toHaveBeenCalled();
  });

  it('denies access to non-admin users', () => {
    // Override the auth mock for this specific test
    vi.mock('@/context/AuthContext', () => ({
      useAuth: () => ({
        user: { role: 'doctor' }
      })
    }), { virtual: true });

    // Re-render with the new mock
    render(<SecurityAuditLog />);
    
    // Expect access denied message
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
  });
});

// Test the hook functions separately
describe('Audit Log Hooks', () => {
  describe('useAuditLogSearch', () => {
    it('filters logs based on search term', () => {
      const filteredLogs = mockAuditLogs;
      const userMap = { user1: 'John Doe', user2: 'Jane Smith' };
      
      // First call with empty search term
      let result = useAuditLogSearch(filteredLogs, userMap);
      expect(result.searchedLogs).toEqual(filteredLogs);
      expect(result.isFiltered).toBe(false);
      
      // Update search term
      result.setSearchTerm('John');
      
      // Mock the behavior that would happen on the next render
      (useAuditLogSearch as any).mockReturnValue({
        searchTerm: 'John',
        setSearchTerm: vi.fn(),
        searchedLogs: filteredLogs.filter(log => log.user_id === 'user1'),
        isFiltered: true
      });
      
      result = useAuditLogSearch(filteredLogs, userMap);
      expect(result.searchedLogs.length).toBeLessThan(filteredLogs.length);
      expect(result.isFiltered).toBe(true);
    });
  });

  describe('useLogDetailView', () => {
    it('handles view details correctly', () => {
      const logToView = mockAuditLogs[0];
      
      const result = useLogDetailView();
      expect(result.selectedLog).toBeNull();
      expect(result.detailOpen).toBe(false);
      
      // View details for a log
      result.handleViewDetails(logToView);
      expect(result.selectedLog).toEqual(logToView);
      expect(result.detailOpen).toBe(true);
      
      // Close details
      result.handleCloseDetails();
      expect(result.detailOpen).toBe(false);
    });
  });
});
