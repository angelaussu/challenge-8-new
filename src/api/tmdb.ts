const TOKEN = import.meta.env.VITE_READ_ACCESS_TOKEN as string;
const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export interface Movie {
  id: number;
  title: string;
  key?: string;
  backdrop_path: string;
  overview?: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  site: string;
  type: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  release_dates?: {
    results: {
      iso_3166_1: string;
      release_dates: {
        certification: string;
        note?: string;
        release_date: string;
        type: number;
      }[];
    }[];
  };
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
}

export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
};

export type MovieVideo = {
  id: string;
  key: string;
  name: string;
  site: string; // "YouTube"
  type: string; // "Trailer", "Teaser", dll
};

export async function getMovieVideos(movieId: number): Promise<MovieVideo[]> {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/videos`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  const data = await res.json();
  return data.results;
}

export async function getTrending(): Promise<Movie[]> {
  const res = await fetch(`${BASE_URL}/trending/movie/week`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  const data = await res.json();
  return data.results.slice(0, 20);
}

export async function getNewRelease(): Promise<Movie[]> {
  const allMovies: Movie[] = [];
  let page = 1;

  while (allMovies.length < 50) {
    const res = await fetch(`${BASE_URL}/movie/now_playing?page=${page}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    const data = await res.json();

    if (!data.results || data.results.length === 0) break;

    allMovies.push(...data.results);
    page++;
  }

  return allMovies.slice(0, 50);
}

export async function getMovieById(id: number): Promise<Movie> {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?append_to_response=credits,release_dates`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }
  );
  return res.json();
}

// src/api/tmdb.ts

export async function getMovieDetail(
  id: string | number
): Promise<MovieDetailResponse> {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?append_to_response=credits`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
  return res.json();
}

// src/api/tmdb.ts

export interface MovieDetailResponse {
  id: number;
  title: string;
  overview: string;
  backdrop_path?: string;
  poster_path?: string;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: { id: number; name: string; job: string }[];
  };
}
