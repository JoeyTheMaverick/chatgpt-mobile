'use client';
import { useEffect, useState } from 'react';
import ConversationList from '@/components/ConversationList';
import ChatWindow from '@/components/ChatWindow';
import MessageInput from '@/components/MessageInput';
import { supabase } from '@/lib/supabaseClient';
import { Button } from 'react-bootstrap';
import { Message, Conversation } from '@/types';
import { trpc } from '@/utils/trpc';


const COLORS = {
  mistBlue: "#e6eff6",    // app background, chat background
  sageGreen: "#dbeee2",   // user bubble
  lightGray: "#f6f7f9",   // card, input background
  slate: "#6b7a8f",       // header, sidebar, text, buttons
  taupe: "#c7bca1",       // borders, assistant bubble border
  white: "#ffffff",       // assistant bubble, highlights
};



export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const generateText = trpc.openrouter.generateText.useMutation();

  useEffect(() => {
    async function fetchConversations() {
      setLoadingConversations(true);
      try {
        const { data, error } = await supabase.from('conversations').select('id, title');
        if (error) throw error;
        setConversations(data || []);
        if (data && data.length > 0) setSelectedId(data[0].id);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoadingConversations(false);
      }
    }
    fetchConversations();
  }, []);

  
  useEffect(() => {
    if (!selectedId) return;
    async function fetchMessages() {
      setLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id, content, created_at, role')
          .eq('conversation_id', selectedId);
        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    }
    fetchMessages();
  }, [selectedId]);

  const handleSend = async (content: string) => {
    if (!selectedId) return;

    // Add user's message
    const tempId = Date.now().toString();
    setMessages((msgs) => [
      ...msgs,
      { id: tempId, content, created_at: new Date().toISOString(), role: 'user' as const }
    ]);

    let aiMessage;

    if (content.toLowerCase().startsWith('image:')) {
      // Optional: keep Gemini image generation or handle differently
      // For now, fallback message:
      aiMessage = {
        id: Date.now().toString() + '-ai',
        content: 'Image generation is not supported yet.',
        created_at: new Date().toISOString(),
        role: 'assistant' as const,
      };
    } else {
      // TEXT GENERATION using OpenRouter
      const response = await generateText.mutateAsync({ prompt: content });
      aiMessage = {
        id: Date.now().toString() + '-ai',
        content: response?.text || 'Sorry, I could not generate a reply.',
        created_at: new Date().toISOString(),
        role: 'assistant' as const,
      };
    }

    setMessages((msgs) => [...msgs, aiMessage]);
  };

  const handleNewConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{ title: 'New Chat' }])
        .select('id, title');
      if (error) throw error;
      setConversations((convos) => [...convos, ...(data || [])]);
      if (data && data.length > 0) setSelectedId(data[0].id);
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  if (loadingConversations) return <div>Loading conversations...</div>;
  if (conversations.length === 0) return (
    <div>
      No conversations yet.
      <button onClick={handleNewConversation}>Create a new conversation</button>
    </div>
  );

  return (
  <div
    style={{
      width: 375,
      height: '100vh',
      margin: '0 auto',
      background: COLORS.mistBlue,
      boxShadow: '0 0 24px rgba(0,0,0,0.08)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Sidebar */}
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-260px',
        width: 240,
        height: '100vh',
        background: COLORS.slate,
        color: COLORS.white,
        boxShadow: '2px 0 12px rgba(0,0,0,0.07)',
        zIndex: 1002,
        transition: 'left 0.3s',
        borderRight: `2px solid ${COLORS.taupe}`,
        padding: '2rem 1rem 1rem 1rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <button
        onClick={() => setSidebarOpen(false)}
        style={{
          alignSelf: 'flex-end',
          background: 'none',
          border: 'none',
          fontSize: 28,
          marginBottom: 16,
          cursor: 'pointer',
          color: COLORS.white,
        }}
        aria-label="Close sidebar"
      >
        &times;
      </button>
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={id => { setSelectedId(id); setSidebarOpen(false); }}
        onNewConversation={handleNewConversation}
      />
    </div>

    {/* Overlay */}
    {sidebarOpen && (
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          zIndex: 1000,
        }}
      />
    )}

    {/* Header */}
    <div
      style={{
        textAlign: 'center',
        padding: '0.5rem',
        backgroundColor: COLORS.slate,
        color: COLORS.white,
        borderBottom: `2px solid ${COLORS.taupe}`,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'absolute',
          top: '50%',
          left: 12,
          transform: 'translateY(-50%)',
          zIndex: 1,
          background: 'none',
          border: 'none',
          fontSize: 28,
          color: COLORS.white,
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="Open sidebar"
      >
        &#9776;
      </button>
      <h5 style={{ margin: 0, color: COLORS.white }}>ChatGPT Clone</h5>
    </div>

    {/* Chat Window */}
    <div style={{
      flex: 1,
      minHeight: 0,
      background: COLORS.mistBlue,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <ChatWindow messages={messages} />
    </div>

    {/* Input */}
    <div style={{
      padding: '0.25rem 0.5rem',
      backgroundColor: COLORS.lightGray,
      borderTop: `2px solid ${COLORS.taupe}`,
      flexShrink: 0,
    }}>
      <MessageInput conversationId={selectedId} onSend={handleSend} />
    </div>
  </div>
  );
}
