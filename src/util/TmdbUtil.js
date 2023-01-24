import axios from 'axios';

export function searchPerson(query) {
	let q = query;
	if (query === "Charles Chaplin"){
		q = "Charlie Chaplin";
	}
	return axios.get("https://api.themoviedb.org/3/search/person", {
		params: {
			api_key: process.env.REACT_APP_TMDB_API_KEY,
			query: q
		}
	});
}

export function searchMovie(query, year) {
	return axios.get("https://api.themoviedb.org/3/search/movie", {
		params: {
			api_key: process.env.REACT_APP_TMDB_API_KEY,
			query: query,
			primary_release_year: year,
		}
	});
}

export function searchTV(query) {
	return axios.get("https://api.themoviedb.org/3/search/tv", {
		params: {
			api_key: process.env.REACT_APP_TMDB_API_KEY,
			query: query
		}
	});
}

export function getTMDBImage(path, size) {
	if (path == null) {
		return null;
	}

	const imageSizes = {
		lg: "w600_and_h900_bestv2",
		md: "w300_and_h450_bestv2",
		sm: "w150_and_h225_bestv2"
	};

	return `https://image.tmdb.org/t/p/${imageSizes[size]}${path}`;
}
