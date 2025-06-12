import React, { useRef, useEffect, useState } from 'react';
import { ListGroup, Card, Badge, Image } from 'react-bootstrap';
import parse from 'html-react-parser';
import { Message } from '@/types';

type Props = {
  messages: Message[];
};

function MessageTime({ iso }: { iso: string }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    setTime(new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [iso]);
  return <small className="text-muted ms-2">{time}</small>;
}

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  const COLORS = {
  mistBlue: "#e6eff6",    // app background, chat background
  sageGreen: "#dbeee2",   // user bubble
  lightGray: "#f6f7f9",   // card, input background
  slate: "#6b7a8f",       // header, sidebar, text, buttons
  taupe: "#c7bca1",       // borders, assistant bubble border
  white: "#ffffff",       // assistant bubble, highlights
  };


  return (
    <Card
      style={{
        flex: 1,
        minHeight: 0,
        border: 'none',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: 0,
        background: COLORS.lightGray,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Card.Body
        style={{
          flex: 1,
          minHeight: 0,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: COLORS.lightGray,
        }}
      >
        <ListGroup variant="flush" style={{ gap: '1rem', flex: 1 }}>
          {messages.map((msg) => (
            <ListGroup.Item
              key={msg.id}
              style={{
                border: msg.role === 'user' ? 'none' : `1px solid ${COLORS.taupe}`,
                borderRadius: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: msg.role === 'user' ? COLORS.sageGreen : COLORS.white,
                color: COLORS.slate,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                marginLeft: msg.role === 'user' ? 'auto' : '0',
                marginRight: msg.role === 'user' ? '0' : 'auto',
                boxShadow: '0 2px 8px rgba(107,122,143,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                <Badge
                  as="span"
                  className="" // This clears out any default Bootstrap badge classes
                  style={{
                    marginRight: '0.5rem',
                    background: msg.role === 'user' ? COLORS.slate : COLORS.taupe,
                    color: msg.role === 'user' ? COLORS.white : COLORS.slate,
                    fontWeight: 500,
                    fontSize: '0.8em',
                    borderRadius: '0.5rem',
                    padding: '0.35em 0.9em',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                >
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </Badge>
              </div>
              {msg.content.startsWith('http://') ||
              msg.content.startsWith('https://') ||
              msg.content.startsWith('data:image') ? (
                <Image src={msg.content} alt="Generated" fluid style={{ maxWidth: '100%', borderRadius: '0.5rem' }} />
              ) : (
                <div style={{ lineHeight: '1.5' }}>
                  <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div ref={bottomRef} />
      </Card.Body>
    </Card>
  );
}
