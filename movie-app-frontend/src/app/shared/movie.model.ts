export interface Movie {
    id: number;
    title: string;
    description: string | null
    date: string
    hates: number
    likes: number
    user: {
        id: number;
        email: string;
        username: string;
    } | null
    review: string | null;
    selected?: boolean;
    loading?: boolean | null;
}

export interface ProfileMovies {
    id: number;
    title: string;
    description: string | null
    user: number;
    date: string;
    hates: number;
    likes: number;
   
}

export interface MovieResonse {
    movie_list: Movie[]
}