/**
 * EmDash live content collection.
 *
 * One `_emdash` collection serves every EmDash content type from the database.
 * Query posts with getEmDashCollection('posts') / getEmDashEntry('posts', slug)
 * (see src/lib/posts.ts).
 */
import { defineLiveCollection } from 'astro:content';
import { emdashLoader } from 'emdash/runtime';

export const collections = {
  _emdash: defineLiveCollection({ loader: emdashLoader() }),
};
