import React, { useState, useEffect } from "react";
import DisplayImages from "./displayImages";

export default function Gallery() {

  const [cards, setCards] = useState([]);
  const [cardsLoaded, setCardsLoaded] = useState(false);
  const [category, setCategory] = useState('top');

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
    <div>
      <h1>Gallery</h1>
      <p>Get Inspired by others!</p>
      <DisplayImages cards={cards} cardsLoaded={cardsLoaded} />
    </div>
  );
}
