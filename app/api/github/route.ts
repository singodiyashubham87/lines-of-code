import { NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com/graphql';
const CODETABS_API = 'https://api.codetabs.com/v1/loc';

export async function POST(req: Request) {
  try {
    const { username, repository, branch = 'main' } = await req.json();
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // If repository is provided, fetch specific repo data
    if (repository) {
      const locData = await fetchRepoLOC(username, repository, branch);
      return NextResponse.json({ data: locData });
    }

    // Fetch all public repos
    const repos = await fetchUserRepos(username, token);
    const locData = await fetchAllReposLOC(repos, username);
    return NextResponse.json({ data: locData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}

async function fetchUserRepos(username: string, token: string) {
  const query = `
    query ($username: String!) {
      user(login: $username) {
        repositories(first: 100, privacy: PUBLIC) {
          nodes {
            name
            defaultBranchRef {
              name
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.user.repositories.nodes;
}

async function fetchRepoLOC(
  username: string,
  repository: string,
  branch: string
) {
  const response = await fetch(
    `${CODETABS_API}/?github=${username}/${repository}&branch=${branch}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch LOC for ${repository}`);
  }

  return await response.json();
}

async function fetchAllReposLOC(repos: any[], username: string) {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const results: any = {};

  for (const repo of repos) {
    try {
      const data = await fetchRepoLOC(username, repo.name, repo.defaultBranchRef?.name || 'main');
      results[repo.name] = data;
      await delay(500); // Rate limiting delay
    } catch (error) {
      console.error(`Error fetching LOC for ${repo.name}:`, error);
      results[repo.name] = { error: 'Failed to fetch LOC data' };
    }
  }

  return results;
}