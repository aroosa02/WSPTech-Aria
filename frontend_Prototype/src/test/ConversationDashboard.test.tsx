import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConversationDashboardPage } from '../pages/ConversationDashboardPage';

describe('ConversationDashboardPage Component', () => {
  it('renders the header and initial conversations list', () => {
    render(<ConversationDashboardPage language="en" />);

    expect(screen.getByText('Customer Conversations')).toBeInTheDocument();
    
    // Check if initial dummy customers are listed in the sidebar
    expect(screen.getByRole('heading', { level: 4, name: 'Zainab Malik' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Muhammad Ali' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Ayesha Khan' })).toBeInTheDocument();
  });

  it('renders escalation and status indicators correctly', () => {
    render(<ConversationDashboardPage language="en" />);
    
    // Zainab Malik is Escalated
    const zainabCard = screen.getByRole('heading', { level: 4, name: 'Zainab Malik' }).closest('.glass-card');
    expect(zainabCard).toBeInTheDocument();
    expect(screen.getAllByText('ESCALATED')[0]).toBeInTheDocument();

    // John Doe is Resolved
    expect(screen.getByText('RESOLVED')).toBeInTheDocument();
  });

  it('filters conversations by status pills', () => {
    render(<ConversationDashboardPage language="en" />);

    // Initially all conversations are visible
    expect(screen.getByRole('heading', { level: 4, name: 'Zainab Malik' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'John Doe' })).toBeInTheDocument();

    // Click 'Escalated' pill
    const escalatedPill = screen.getByRole('button', { name: /Escalated/ });
    fireEvent.click(escalatedPill);

    // Only escalated ones should be visible in the sidebar
    expect(screen.getByRole('heading', { level: 4, name: 'Zainab Malik' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 4, name: 'John Doe' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Ayesha Khan' })).toBeInTheDocument();

    // Click 'Resolved' pill
    const resolvedPill = screen.getByRole('button', { name: /Resolved/ });
    fireEvent.click(resolvedPill);

    expect(screen.queryByRole('heading', { level: 4, name: 'Zainab Malik' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'John Doe' })).toBeInTheDocument();
  });

  it('filters conversations by search query', () => {
    render(<ConversationDashboardPage language="en" />);

    const searchInput = screen.getByPlaceholderText('Search conversations...');
    
    // Search for 'Muhammad' (not 'Ali' because 'Malik' contains 'ali')
    fireEvent.change(searchInput, { target: { value: 'Muhammad' } });
    
    expect(screen.getByRole('heading', { level: 4, name: 'Muhammad Ali' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 4, name: 'Zainab Malik' })).not.toBeInTheDocument();

    // Search for something inside messages e.g. 'refund'
    fireEvent.change(searchInput, { target: { value: 'refund' } });
    
    expect(screen.getByRole('heading', { level: 4, name: 'Ayesha Khan' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 4, name: 'Muhammad Ali' })).not.toBeInTheDocument();
  });

  it('displays chat details when selecting a conversation', () => {
    render(<ConversationDashboardPage language="en" />);

    // Click John Doe card to open it
    const johnCard = screen.getByRole('heading', { level: 4, name: 'John Doe' });
    fireEvent.click(johnCard);

    // Check if right pane shows header for John Doe and assignee Sarah (Agent)
    expect(screen.getByRole('heading', { level: 3, name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByText('Assignee: Sarah (Agent)')).toBeInTheDocument();
    
    // Check if historical messages render
    expect(screen.getByText('Where can I find the API key for my integrations?')).toBeInTheDocument();
    expect(screen.getByText('API integration is working perfectly now, thank you!')).toBeInTheDocument();
  });

  it('handles support specialist takeover for escalated chats', () => {
    render(<ConversationDashboardPage language="en" />);

    // Select Zainab Malik (which is Escalated and Assignee: Unassigned)
    const zainabCard = screen.getByRole('heading', { level: 4, name: 'Zainab Malik' });
    fireEvent.click(zainabCard);

    // Verify Take Over Chat button exists
    const takeOverBtn = screen.getByRole('button', { name: /Take Over Chat/i });
    expect(takeOverBtn).toBeInTheDocument();

    // Click Take Over Chat
    fireEvent.click(takeOverBtn);

    // Assignee should become Sarah (Agent) and status should become Active
    expect(screen.getByText('Assignee: Sarah (Agent)')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Take Over Chat/i })).not.toBeInTheDocument();
  });

  it('allows agent to send a message to the customer', () => {
    render(<ConversationDashboardPage language="en" />);

    // Select Zainab Malik
    const zainabCard = screen.getByRole('heading', { level: 4, name: 'Zainab Malik' });
    fireEvent.click(zainabCard);

    // Type a reply
    const input = screen.getByPlaceholderText('Type reply as customer support specialist...');
    fireEvent.change(input, { target: { value: 'Hello Zainab, I am here to help you!' } });

    // Send the reply
    const sendBtn = screen.getByLabelText('Send reply');
    fireEvent.click(sendBtn);

    // The reply appears twice: 1) in the chat details feed, 2) in the left sidebar card preview snippet
    expect(screen.getAllByText('Hello Zainab, I am here to help you!').length).toBe(2);
    expect(screen.getByText('Sarah (Support)')).toBeInTheDocument();
  });
});
