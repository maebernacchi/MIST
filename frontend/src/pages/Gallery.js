/**
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


// +-------------+----------------------------------------------------------------------
// | Gallery.js  |
// +-------------+

/**
 * This is the Gallery.js
 * This file is that displays the Gallery page. It calls displayImages.js
 * in order to display the images and the pagination.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 *
 */

// +-------------+----------------------------------------------------------------------
// | Imports     |
// +-------------+
import React, { useState, useEffect } from "react";
import DisplayImages from "./components/displayImages";

/**
 * Gallery Page
 */

export default function Gallery() {

  const [cards, setCards] = useState([]);
  const [cardsLoaded, setCardsLoaded] = useState(false);
  const [category] = useState('top');

  useEffect(() => {
    //fetch(`${process.env.REACT_APP_API_SERVER}/gallery`)
    switch (category) {
      case 'recent':
        fetch('/api/gallery/recent')
        .then(req => req.json())
        .then(cards => { setCards(cards); setCardsLoaded(true) });
        break;
      case 'top':
        fetch('/api/gallery/top-rated')
        .then(req => req.json())
        .then(cards => { setCards(cards); setCardsLoaded(true) });
        break;
      case 'featured':
        fetch('/api/gallery/featured')
        .then(req => req.json())
        .then(cards => { setCards(cards); setCardsLoaded(true) });
        break;
      default:
        fetch('/api/gallery/random')
        .then(req => req.json())
        .then(cards => { setCards(cards); setCardsLoaded(true) });
    }}, [category])

  return (
    <div style={{marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem"}}>
      <h1>Gallery</h1>
      <p>Get Inspired by others!</p>
      <DisplayImages cards={cards} cardsLoaded={cardsLoaded} />
    </div>
  );
}