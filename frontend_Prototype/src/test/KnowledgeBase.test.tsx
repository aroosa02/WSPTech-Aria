import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { KnowledgeBasePage } from '../pages/KnowledgeBasePage';

describe('KnowledgeBasePage Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the page title and initial FAQ items', () => {
    render(<KnowledgeBasePage language="en" />);
    
    expect(screen.getByText('Knowledge Base Management')).toBeInTheDocument();
    expect(screen.getByText('How do I upgrade my subscription plan?')).toBeInTheDocument();
    expect(screen.getByText('What are the main endpoints in the Aria API?')).toBeInTheDocument();
  });

  it('filters FAQ items by search query', () => {
    render(<KnowledgeBasePage language="en" />);
    
    const searchInput = screen.getByPlaceholderText('Search questions, answers, or sources...');
    
    // Search for "upgrade"
    fireEvent.change(searchInput, { target: { value: 'upgrade' } });
    expect(screen.getByText('How do I upgrade my subscription plan?')).toBeInTheDocument();
    expect(screen.queryByText('What are the main endpoints in the Aria API?')).not.toBeInTheDocument();
  });

  it('filters FAQ items by category pill', () => {
    render(<KnowledgeBasePage language="en" />);
    
    // Select "Billing" category pill
    const billingPill = screen.getByRole('button', { name: 'Billing' });
    fireEvent.click(billingPill);
    
    expect(screen.getByText('How do I upgrade my subscription plan?')).toBeInTheDocument();
    expect(screen.queryByText('What are the main endpoints in the Aria API?')).not.toBeInTheDocument();
  });

  it('opens modal, fills out and adds a new FAQ successfully', async () => {
    render(<KnowledgeBasePage language="en" />);
    
    // Click Add FAQ to open modal
    const addBtn = screen.getByRole('button', { name: /Add FAQ/i });
    fireEvent.click(addBtn);
    
    // Check if modal forms are visible
    expect(screen.getByText('Create FAQ grounding article')).toBeInTheDocument();
    
    const questionInput = screen.getByPlaceholderText('e.g. How can I request a refund?');
    const answerInput = screen.getByPlaceholderText(/Refund requests should be processed/);
    const citationInput = screen.getByPlaceholderText('e.g. Refund DB');
    const submitBtn = screen.getByRole('button', { name: 'Save FAQ' });
    
    // Fill out the form
    fireEvent.change(questionInput, { target: { value: 'How can I change my profile?' } });
    fireEvent.change(answerInput, { target: { value: 'Go to Settings and click Edit Profile to update details.' } });
    fireEvent.change(citationInput, { target: { value: 'Profile DB' } });
    
    // Submit form
    fireEvent.click(submitBtn);
    
    // Verify it is added to the list
    expect(screen.getByText('How can I change my profile?')).toBeInTheDocument();
    expect(screen.getByText('Profile DB')).toBeInTheDocument();
    
    // Status should be "Pending" for the new FAQ
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  it('triggers database sync and updates pending status', () => {
    render(<KnowledgeBasePage language="en" />);
    
    // Add a new FAQ so we have a pending item
    const addBtn = screen.getByRole('button', { name: /Add FAQ/i });
    fireEvent.click(addBtn);
    
    fireEvent.change(screen.getByPlaceholderText('e.g. How can I request a refund?'), { target: { value: 'Query A' } });
    fireEvent.change(screen.getByPlaceholderText(/Refund requests should be processed/), { target: { value: 'Answer A' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Refund DB'), { target: { value: 'Citation A' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save FAQ' }));

    expect(screen.getByText(/pending/i)).toBeInTheDocument();

    // Click Sync Vector DB
    const syncBtn = screen.getByRole('button', { name: /Sync Vector DB/i });
    fireEvent.click(syncBtn);
    
    // Verify sync loader starts
    expect(screen.getByText('Syncing...')).toBeInTheDocument();
    
    // Advance timers to simulate the API sync finish
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Check if status is now Synced and loader finished
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Sync Vector DB/i)).toBeInTheDocument();
  });
});
