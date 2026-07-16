import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageBubble } from '../components/MessageBubble';
import { TopAppBar } from '../components/TopAppBar';
import { EscalationCard } from '../components/EscalationCard';
import { InputBar } from '../components/InputBar';

describe('MessageBubble Component', () => {
  it('renders user message correctly without citation', () => {
    render(<MessageBubble sender="user" text="Hello world" time="10:00 AM" language="en" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
  });

  it('renders Aria message with citation chip', () => {
    render(<MessageBubble sender="aria" text="Aria answer" time="10:01 AM" citation="Billing DB" language="en" />);
    expect(screen.getByText('Aria answer')).toBeInTheDocument();
    expect(screen.getByText('10:01 AM')).toBeInTheDocument();
    expect(screen.getByText('Billing DB')).toBeInTheDocument();
  });
});

describe('TopAppBar Component', () => {
  it('renders title and triggers language switch', () => {
    const handleLanguageChange = vi.fn();
    const handleNewConversation = vi.fn();
    
    render(
      <TopAppBar
        language="en"
        onLanguageChange={handleLanguageChange}
        onNewConversation={handleNewConversation}
      />
    );
    
    expect(screen.getByText('Aria')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
    
    const langBtn = screen.getByLabelText('Toggle language');
    fireEvent.click(langBtn);
    expect(handleLanguageChange).toHaveBeenCalled();
    
    const newConvBtn = screen.getByText('New conversation');
    fireEvent.click(newConvBtn);
    expect(handleNewConversation).toHaveBeenCalled();
  });
});

describe('EscalationCard Component', () => {
  it('renders support prompt and triggers connection action', () => {
    const handleConnect = vi.fn();
    render(<EscalationCard language="en" onConnect={handleConnect} />);
    
    expect(screen.getByText("Let's get you a specialist")).toBeInTheDocument();
    const connectBtn = screen.getByText('Connect me with an agent');
    fireEvent.click(connectBtn);
    expect(handleConnect).toHaveBeenCalled();
  });
});

describe('InputBar Component', () => {
  it('renders input, typing text and triggers send on button click', () => {
    const handleChange = vi.fn();
    const handleSend = vi.fn();
    
    render(
      <InputBar
        language="en"
        value="typing..."
        onChange={handleChange}
        onSend={handleSend}
      />
    );
    
    const input = screen.getByPlaceholderText('Type a message...');
    expect(input).toHaveValue('typing...');
    
    fireEvent.change(input, { target: { value: 'new text' } });
    expect(handleChange).toHaveBeenCalledWith('new text');
    
    const sendBtn = screen.getByLabelText('Send message');
    fireEvent.click(sendBtn);
    expect(handleSend).toHaveBeenCalled();
  });
});
