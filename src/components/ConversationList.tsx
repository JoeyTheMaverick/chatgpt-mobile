import { ListGroup, Button } from 'react-bootstrap';

type Conversation = {
  id: string;
  title: string;
};

type Props = {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
};

const COLORS = {
  mistBlue: "#e6eff6",
  sageGreen: "#dbeee2",
  lightGray: "#f6f7f9",
  slate: "#6b7a8f",
  taupe: "#c7bca1",
  white: "#ffffff",
};


export default function ConversationList({ conversations, selectedId, onSelect, onNewConversation }: Props) {
  return (
    <aside
      style={{
        background: COLORS.lightGray,
        borderRadius: '1.25rem',
        boxShadow: '0 4px 24px rgba(107, 122, 143, 0.08)', // softer shadow using slate
        padding: '1.5rem 1rem',
        minWidth: 220,
        maxWidth: 260,
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Button
        variant="outline-primary"
        onClick={onNewConversation}
        style={{
          width: '100%',
          borderRadius: '0.75rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          background: COLORS.sageGreen,
          color: COLORS.slate,
          border: `1.5px solid ${COLORS.taupe}`,
          boxShadow: 'none',
        }}
      >
        + New Conversation
      </Button>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {conversations.map((conv) => (
            <ListGroup.Item
              key={conv.id}
              action
              active={conv.id === selectedId}
              onClick={() => onSelect(conv.id)}
              style={{
                borderRadius: '0.75rem',
                marginBottom: '0.5rem',
                background: conv.id === selectedId ? COLORS.slate : COLORS.white,
                color: conv.id === selectedId ? COLORS.white : COLORS.slate,
                fontWeight: conv.id === selectedId ? 600 : 500,
                border: `1.5px solid ${conv.id === selectedId ? COLORS.slate : COLORS.taupe}`,
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {conv.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </aside>
  );
}
