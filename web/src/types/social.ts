import { Product } from './product';

export interface SocialContent {
  _id: string;
  title: string;
  type: 'story' | 'reel';
  videoUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  externalUrl?: string;
  isFeatured?: boolean;
  linkedProducts?: Product[];
  publishDate?: string;
}
