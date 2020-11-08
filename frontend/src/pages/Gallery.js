// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * gallery.js
 * 
 * This exports the gallery pages (featured, random, toprated, recent).
 * It calls displayImages.js in order to display the images and the pagination.
 * Currently no buttons to switch pages, but the code for the pages is there.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licensed under a LGLP 3.0 or later .....
 *
 */

// +-------------+----------------------------------------------------------------------
// | Imports     |
// +-------------+
import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import DisplayImages from "./components/displayImages";
import { Button } from 'react-bootstrap';


export default function Gallery() {
	const [cards, setCards] = useState([]);
	const [cardsLoaded, setCardsLoaded] = useState(false);

	const { category } = useParams();

	// fetch the images, depending on what category is selected
	useEffect(() => {
		console.log('using effect');
		GalleryImagesFetch(category)
			.then(res => res.json())
			.then(cards => { setCards(cards); setCardsLoaded(true) });
	}, [category]);

	return (
		<div style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}>
			<h1>Gallery</h1>
			<p>Get Inspired by others!</p>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Link to='/gallery/recent'>
					<Button variant="outline-dark" >
						Recent
					</Button> &nbsp;&nbsp;&nbsp;
				</Link>
				<Link to='/gallery/featured'>
					<Button variant="outline-dark" >
						Featured
					</Button> &nbsp;&nbsp;&nbsp;
				</Link>
				<Link to='/gallery/top-rated' >
					<Button variant="outline-dark" >
						Top Rated
					</Button> &nbsp;&nbsp;&nbsp;
				</Link>
				<Link to='/gallery/random'>
					<Button variant="outline-dark" href="/gallery/random">
						Random
			        </Button>
				</Link>
			</div>
			<DisplayImages cards={cards} cardsLoaded={cardsLoaded} />
		</div>
	);
}
function _getAPIRoute(str) {
	return `/api?action=${str}`;
}
function GalleryImagesFetch(category) {
	const route = function(){
		switch(category){
			case 'recent': return _getAPIRoute('getRecentImages');
			case 'featured': return _getAPIRoute('getFeaturedImages');
			case 'top-rated': return _getAPIRoute('getTopImages');
			case 'random': return _getAPIRoute('getRandomImages');
			default: 
				console.log('Default, perhaps unknown category');
				return _getAPIRoute('getRecentImages');
				}
			}();
	return fetch(route);
}
