import { useState, useEffect, useRef } from 'react';
import style from './productList.module.css';

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
		console.log(data);

		if (data.products.length === 0) {
			setHasMore(false);
		} else {
			setProducts(prevProducts => [...prevProducts, ...data.products]);
			setPage(prevPage => prevPage + 1);
		}
	}

	return (
		<>
			<h1 className={style.title}>
				Infinite Scrolling with IntersectionObserver API and ReactJS
			</h1>
			<div className={style.container}>
				{products.map(item => (
					<ul className={style.ul} key={item.id}>
						<li className={style.li}>
							<p className={style.name}>{item.title}</p>
							<p className={style.description}>{item.description}</p>
							<p className={style.brand}>{item.brand}</p>
						</li>
						<img className={style.img} src={item.images[0]} alt={item.title} />
					</ul>
				))}
			</div>
			{hasMore && (
				<div className={style.loading} ref={elementRef}>
					Loading items...
				</div>
			)}
		</>
	);
};

export default ProductList;
