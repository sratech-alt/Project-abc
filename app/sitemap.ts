import type { MetadataRoute } from 'next';
import { getProjects, getServices } from '@/lib/catalog';
import { getJobs, getPosts } from '@/lib/content';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

/** The home page, the service and project pages, plus the blog and careers pages once they have content. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, jobs, services, projects] = await Promise.all([getPosts(), getJobs(), getServices(), getProjects()]);
  const entries: MetadataRoute.Sitemap = [{ url: `${site.url}/`, changeFrequency: 'monthly', priority: 1 }];

  for (const service of services) {
    entries.push({ url: `${site.url}/services/${service.id}`, changeFrequency: 'monthly', priority: 0.8 });
  }
  for (const project of projects) {
    entries.push({ url: `${site.url}/projects/${project.id}`, changeFrequency: 'monthly', priority: 0.7 });
  }
  entries.push({ url: `${site.url}/privacy`, changeFrequency: 'yearly', priority: 0.2 });

  if (posts.length > 0) {
    entries.push({ url: `${site.url}/blog`, lastModified: posts[0].publishedAt, changeFrequency: 'weekly', priority: 0.8 });
    for (const post of posts) {
      entries.push({ url: `${site.url}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: 'monthly', priority: 0.7 });
    }
  }

  if (jobs.length > 0) {
    entries.push({ url: `${site.url}/careers`, lastModified: jobs[0].postedAt, changeFrequency: 'weekly', priority: 0.6 });
    for (const job of jobs) {
      entries.push({ url: `${site.url}/careers/${job.slug}`, lastModified: job.postedAt, changeFrequency: 'weekly', priority: 0.5 });
    }
  }

  return entries;
}
