import { Product } from './product';

export interface SocialContent {
  _id: string;
  title: string;
  type: 'story' | 'reel' | 'blog' | 'post';
  videoUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  tagline?: string;
  externalUrl?: string;
  isFeatured?: boolean;
  linkedProducts?: Product[];
  publishDate?: string;
}
