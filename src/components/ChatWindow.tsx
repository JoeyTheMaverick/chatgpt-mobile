'use client';
import React, { useRef, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import parse from 'html-react-parser';

type Message = {
  id: string;
  content: string;
  created_at: string;
};

type Props = {
  messages: Message[];
};

function MessageTime({ iso }: { iso: string }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    setTime(new Date(iso).toLocaleTimeString());
  }, [iso]);
  return <small className="text-muted">{time}</small>;
}

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ height: '70vh', overflowY: 'auto', background: '#f8f9fa', padding: '1rem' }}>
      <ListGroup>
        {messages.map((msg) => (
          <ListGroup.Item key={msg.id}>
            <div>{parse(msg.content)}</div>
            <small className="text-muted">{new Date(msg.created_at).toLocaleTimeString()}</small>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div ref={bottomRef} />
    </div>
  );
}
