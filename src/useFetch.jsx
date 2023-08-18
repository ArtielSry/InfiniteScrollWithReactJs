import { useState, useEffect } from 'react';

export function useFetch(url) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetch(url)
			.then(response => response.json())
			.then(data => setData(data))
			.catch(error => {
				if (error.name === 'AbortError') {
					console.log('Request cancelled');
				} else {
					setError(error);
				}
			})
			.finally(() => setLoading(false));
	}, []);
	console.log(data);

	return { data, loading, error };
}
