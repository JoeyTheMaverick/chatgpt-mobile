import { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';


type Props = {
  conversationId: string | null;
  onSend: (content: string) => void;
};

export default function MessageInput({ conversationId, onSend }: Props) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || !conversationId) return;
    onSend(value);
    setValue('');
  };

  const COLORS = {
  mistBlue: "#e6eff6",    // app background, chat background
  sageGreen: "#dbeee2",   // user bubble
  lightGray: "#f6f7f9",   // card, input background
  slate: "#6b7a8f",       // header, sidebar, text, buttons
  taupe: "#c7bca1",       // borders, assistant bubble border
  white: "#ffffff",       // assistant bubble, highlights
};

  return (
    <div>
      <InputGroup>
        <FormControl
          placeholder="Type a message or 'image: your prompt' for an image..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={!conversationId}
          style={{
            borderRadius: '0.75rem',
            border: `1px solid ${COLORS.taupe}`,
            backgroundColor: COLORS.lightGray,
            color: COLORS.slate,
          }}
        />
        <Button
          variant="primary"
          onClick={handleSend}
          disabled={!conversationId}
          style={{
            borderRadius: '0 0.75rem 0.75rem 0',
            backgroundColor: COLORS.slate,
            border: 'none',
            color: COLORS.white,
          }}
        >
          Send
        </Button>
      </InputGroup>
    </div>
  );
}
