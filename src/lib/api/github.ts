import { api } from './axios';

export type RepoInfo = {
	full_name: string;
	description: string | null;
	stargazers_count: number;
	html_url: string;
	language: string | null;
};

/** GitHub API via Axios — call from TanStack Query only. */
export async function fetchRepo(owner: string, repo: string): Promise<RepoInfo> {
	const { data } = await api.get<RepoInfo>(`/repos/${owner}/${repo}`);
	return data;
}

export async function fetchAstroRepo(): Promise<RepoInfo> {
	return fetchRepo('withastro', 'astro');
}
