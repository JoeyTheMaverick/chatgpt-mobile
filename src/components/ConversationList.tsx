'use client';
import React from 'react';
import { ListGroup } from 'react-bootstrap';

type Conversation = {
  id: string;
  title: string;
};

type Props = {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function ConversationList({ conversations, selectedId, onSelect }: Props) {
  return (
    <ListGroup>
      {conversations.map((conv) => (
        <ListGroup.Item
          key={conv.id}
          action
          active={conv.id === selectedId}
          onClick={() => onSelect(conv.id)}
        >
          {conv.title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
