import React, { useState, useEffect } from "react";
import DisplayImages from "./components/displayImages";

/**
 * Gallery Page
 */

export default function Gallery() {

  const [cards, setCards] = useState([]);
  const [cardsLoaded, setCardsLoaded] = useState(false);
  const [category] = useState('recent');

  useEffect(() => {
    //fetch(`${process.env.REACT_APP_API_SERVER}/gallery`)
    switch (category) {
      case 'recent':
        fetch('/api?action=getRecentImages')
        .then(req => req.json())
        .then(cards => { setCards(cards); setCardsLoaded(true) });
        break;
      case 'top':
        fetch('/api?action=getTopImages')
        .then(req => req.json())
        .then(cards => { setCards(cards); setCardsLoaded(true) });
        break;
      case 'featured':
        fetch('/api?action=getFeaturedImages')
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