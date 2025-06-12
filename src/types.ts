export type Message = {
  id: string;
  content: string;
  created_at: string;
  role: 'user' | 'assistant';
};

export type Conversation = {
  id: string;
  title: string;
};
