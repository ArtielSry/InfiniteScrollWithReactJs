import { useState, useEffect, useRef } from 'react';

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);

	const elementRef = useRef(null);

	function onIntersection(entries) {
		const firstEntry = entries[0];
		if (firstEntry.isIntersecting && hasMore) {
			fetchMoreItems();
		}
	}

	useEffect(() => {
		const observer = new IntersectionObserver(onIntersection);
		if (observer && elementRef.current) {
			observer.observe(elementRef.current);
		}
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, [products]);



	async function fetchMoreItems() {
		// fetch los proximos productos
		const response = await fetch(
			`https://dummyjson.com/products?limit=10&skip=${page * 10}`
		);
		const data = await response.json();

		if (data.products.length < 0) {
			setHasMore(false);
		} else {
			setProducts(prevProducts => [...prevProducts, ...data.products]);
			setPage(prevPage => prevPage + 1);
		}
	}

	return (
		<ul>
			{products.map(item => (
				<li key={item.id}>{item.description}</li>
			))}
			{hasMore && <div ref={elementRef}>Loading more items...</div>}
		</ul>
	);
};

export default ProductList;
