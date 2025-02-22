export interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: { id: string; text: string; userId: string }[];
}
