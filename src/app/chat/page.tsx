'use client';
import React, { useState } from 'react';
import ConversationList from '@/components/ConversationList';
import ChatWindow from '@/components/ChatWindow';
import MessageInput from '@/components/MessageInput';

// Dummy data for demonstration
const dummyConversations = [
  { id: '1', title: 'General' },
  { id: '2', title: 'Project X' },
];
const dummyMessages = [
  { id: 'm1', content: 'Hello!', created_at: new Date().toISOString() },
];

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState<string | null>(dummyConversations[0].id);
  const [messages, setMessages] = useState(dummyMessages);

  const handleSend = (content: string) => {
    setMessages((msgs) => [
      ...msgs,
      { id: String(Date.now()), content, created_at: new Date().toISOString() },
    ]);
  };

  return (
    <div className="container-fluid" style={{ maxWidth: 600 }}>
      <div className="row">
        <div className="col-4">
          <ConversationList
            conversations={dummyConversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="col-8 d-flex flex-column">
          <ChatWindow messages={messages} />
          <MessageInput conversationId={selectedId} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
