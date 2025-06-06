// src/components/MessageInput.tsx
import { useState } from 'react';
import { InputGroup, FormControl, Button, Dropdown } from 'react-bootstrap';
import { trpc } from '@/utils/trpc';

type Props = {
  conversationId: any;
  onSend: (content: string) => void;
};

export default function MessageInput({ conversationId, onSend }: Props) {
  const [value, setValue] = useState('');
  const utils = trpc.useContext();

  const sendMessage = trpc.message.create.useMutation({
    onSuccess: () => {
      utils.message.list.invalidate({ conversation_id: conversationId ?? '' });
      setValue('');
    },
  });
  const geminiText = trpc.gemini.generateText.useMutation();
  const geminiImage = trpc.gemini.generateImage.useMutation();

  const handleSend = () => {
    if (!value.trim() || !conversationId) return;
    sendMessage.mutate({ conversation_id: conversationId, content: value });
  };

  const handleGeminiText = async () => {
    if (!value.trim() || !conversationId) return;
    const res = await geminiText.mutateAsync({ prompt: value });
    sendMessage.mutate({ conversation_id: conversationId, content: res.text });
  };

  const handleGeminiImage = async () => {
    if (!value.trim() || !conversationId) return;
    const res = await geminiImage.mutateAsync({ prompt: value });
    if (res.imageUrl) {
      sendMessage.mutate({ conversation_id: conversationId, content: `<img src="${res.imageUrl}" alt="Gemini Image" />` });
    }
  };

  return (
    <InputGroup>
      <FormControl
        placeholder="Type a message or prompt..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        disabled={!conversationId}
      />
      <Dropdown>
        <Dropdown.Toggle variant="secondary">Gemini</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleGeminiText}>Generate Text</Dropdown.Item>
          <Dropdown.Item onClick={handleGeminiImage}>Generate Image</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Button variant="primary" onClick={handleSend} disabled={!conversationId}>
        Send
      </Button>
    </InputGroup>
  );
}
