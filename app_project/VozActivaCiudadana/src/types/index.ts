export type IssueStatus = 'reportado' | 'en_proceso' | 'resuelto';

export interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
}

export interface LocationData {
  latitude: number;
  longitude: number;
  addressText?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  date: string;
  category: string;
  imageUrl: string;
  upvotes: number;
  comments: number;
  location?: LocationData;
  media?: MediaItem[];
  isAnonymous?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}
