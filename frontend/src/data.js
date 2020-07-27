import FeaturedImage1 from "./featuredImages/pic1.png";
import FeaturedImage2 from "./featuredImages/pic2.png";
import FeaturedImage3 from "./featuredImages/pic3.png";
import FeaturedImage4 from "./featuredImages/pic4.png";

/**********************************************************
 *        3. DATA THAT SHOULD COME FROM BACKEND
 *
 **********************************************************
 * CARDS has fields:
 *    id:
 *      this should be a number between 0 and the length of this list -- might be a problem
 *      this is also corresponds with the URL which is '/img/id'
 *    title:
 *      the title of the image
 *    url:
 *      URL name, if we find a way to not having to do the /img/id -- this could be more distinguishable this way
 *      The URL name is basically would be the title with "-" instead of spaces
 *    image:
 *      the image on the particular card
 *    description:
 *      optional, a description given by the user or "" (null)
 *    rating:
 *      the rating of this image
 *    username:
 *      the maker of this image
 *    isAnimated:
 *      if it is animated
 *    code:
 *      the code for this image
 * **********************************************************
 * COMMENTS has fields:
 *    id:
 *      matches up with the corresponding card
 *    username:
 *      username of the maker
 *    comment:
 *      comment the user wrote
 **********************************************************/

/** Might be a problems:
 *      seems like it renders based on the id, and only works for id-s
 *      that 0<= id <= (length - 1)
 */

/** CARDS */

export const Cards = [
  {
    id: 0,
    title: "black & white waves",
    url: "black-and-white-waves",
    image: FeaturedImage1,
    description: "",
    rating: 4,
    username: "@citassy",
    isAnimated: true,
    code: "sin(x)+cos(y)",
  },

  {
    id: 1,
    title: "Christmas Lights",
    url: "colorful-circles",
    image: FeaturedImage2,
    description: "Merry Chrsitmas everyone!",
    rating: 1,
    username: "@vumaiphu",
    isAnimated: false,
    code: "sin(x)+cos(y)",
  },

  {
    id: 2,
    title: "hypnotize",
    url: "hypnotize",
    image: FeaturedImage3,
    rating: 10,
    username: "@berhane",
    isAnimated: true,
    code: "sin(x)+cos(y)",
  },

  {
    id: 3,
    title: "colors and curves",
    url: "colors-and-curves",
    image: FeaturedImage4,
    rating: 7,
    username: "@rebelsky",
    isAnimated: false,
    code: "sin(x)+cos(y)",
  },

  {
    id: 5,
    title: "hypnotize",
    url: "hypnotize",
    image: FeaturedImage3,
    rating: 10,
    username: "@berhane",
    isAnimated: true,
    code: "sin(x)+cos(y)",
  },

  {
    id: 5,
    title: "colors and curves",
    url: "colors-and-curves",
    image: FeaturedImage4,
    rating: 7,
    username: "@rebelsky",
    isAnimated: true,
    code: "sin(x)+cos(y)",
  },
];
/*
const comments = [
  {
    id: 0,
    username: "@rebelsky",
    comment: "Great work!",
  },
  {
    id: 0,
    username: "@rebelsky",
    comment: "Great work!",
  },
];
*/

export default {
  Cards,
};
