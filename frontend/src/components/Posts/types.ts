export interface Post {
    id: number;
    title: string;
    content: string;
    user: {
      username: string;
      is_following: boolean;
    };
  }
  