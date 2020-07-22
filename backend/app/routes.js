/*
const path = require("path");
const api = require('./api');
const database = require('./database');

module.exports = (app, passport, database) => {

    app.get('/api', function (req, res) {
        
        database.getFeaturedImagesLoggedOut(4, (images, error) => {
            if (error) {
                console.log(error);
                res.json([])
            } else if (!images) {
                console.log("no images", images)
                res.json([])
            }
            else {
                console.log("images", images)
                res.json(images);
            }
        })
 
    });

    //------------------------------------------------

    app.get('/api/signup', (req, res) => {

    })

    app.post('/api/signup',

    )

    //------------------------------------------------


    app.get("/api/login", (req, res) => {

    });

    app.post(
        "/api/login",

    );

    //------------------------------------------------

    app.get('/api/image/:imageid', function (req, res) {

    });

    app.post('/api/image/:imageid/', function (req, res) {

        // should correlate with actions?
         
          if (req.body.commentSubmit != null) {
              image.saveComment(req, res, database);
          }
          else if (req.body.delete != null) {
              image.deleteImage(req, res, database);
          }
          else if (req.body.profile != null) {
              image.setProfilePicture(req, res, database); 
              
    }; 
    });


    // Provides MIST image codes. This is a placeholder
    // so that we can display images before we connect
    // the frontend and backend.
    app.get('/api/getSampleCodes', (req, res) => {
        var featuredImages = ["y", "x", "sum(x,y), wsum(x,y)"];
        res.json(featuredImages);
    })

    // Check whether user is signed in
    app.get('/api/getIsSignedIn', (req, res) => {
        var isSignedIn = false;
        res.json(isSignedIn);
    })

    // Get sample (hard-coded) challenges
    app.get('/api/getChallenges', (req, res) => {
        var challenges = [
            {
                userId: 1,
                name: "John",
                title: "Sample Pic 1",
                code: "y",
                createdAt: "7-16-20",
                updatedAt: "7-16-20",
                active: true,
                flag: false,
                category: "Beginning",
                position: "1",
                description: "my first image",
            },
            {
                userId: 2,
                name: "Mai",
                title: "Sample Pic 2",
                code: "x",
                createdAt: "7-16-20",
                updatedAt: "7-16-20",
                active: true,
                flag: false,
                category: "Beginning",
                position: "2",
                description: "my second image",
            },
            {
                userId: 3,
                name: "Asya",
                title: "Sample Pic 3",
                code: "sum(x,y)",
                createdAt: "7-16-20",
                updatedAt: "7-16-20",
                active: true,
                flag: false,
                category: "Beginning",
                position: "3",
                description: "my third image",
            },
        ];
        res.json(challenges);
    })

    // Sends hardcoded cards for displayImages.js. This is a
    // placeholder for until when we'll pass in cards 
    // using queries.
    app.get('/api/getSampleCards', (req, res) => {
        var cards = [
            {
                id: 0,
                title: "black & white waves",
                url: "black-and-white-waves",
                image: "FeaturedImage1",
                description: "",
                rating: 4,
                username: "@citassy",
                isAnimated: true,
                code: "sum(sin(x), cos(y))",
                comments: "",
            },
            {
                id: 1,
                title: "Christmas Lights",
                url: "colorful-circles",
                image: "FeaturedImage2",
                description: "Merry Chrsitmas everyone!",
                rating: 10,
                username: "@vumaiphu",
                isAnimated: false,
                code: "sin(x)",
                comments: "",
            },

            {
                id: 2,
                title: "hypnotize",
                url: "hypnotize",
                image: "FeaturedImage3",
                rating: 10,
                username: "@berhane",
                isAnimated: true,
                code: "cos(y)",
            },

            {
                id: 3,
                title: "colors and curves",
                url: "colors-and-curves",
                image: "FeaturedImage4",
                rating: 7,
                username: "@rebelsky",
                isAnimated: false,
                code: "x",
            },

            {
                id: 4,
                title: "hypnotize",
                url: "hypnotize",
                image: "FeaturedImage3",
                rating: 10,
                username: "@berhane",
                isAnimated: true,
                code: "y",
            },

            {
                id: 5,
                title: "colors and curves",
                url: "colors-and-curves",
                image: "FeaturedImage4",
                rating: 7,
                username: "@rebelsky",
                isAnimated: true,
                code: "sum(sin(x),cos(y))",
            },
        ];
        res.json(cards);
    })

    // provides user information needed for profile page
    // trying to match the userSchema, 
    // but only choose the ones we are using currently for the profile
    app.get('/api/profile', (req, res) => {
        var user = ({
            forename: "shrek",
            surname: "the ogre",
            username: "theShrekster",
            createdAt: new Date().toDateString(),
            about: "first the worst, shrek the best",
            profilepic: "sin(x)"
        });

        var userImages = [
            {
                id: 0,
                title: "image1",
                url: "image1",
                description: "",
                rating: 4,
                username: "@shrek",
                isAnimated: true,
                code: "wsum(sin(x), cos(y))",
                comments: "",
            },
            {
                id: 1,
                title: "image2",
                url: "image2",
                description: "",
                rating: 10,
                username: "@shrek",
                isAnimated: false,
                code: "cos(x)",
                comments: "",
            },
            {
                id: 2,
                title: "image3",
                url: "image3",
                rating: 10,
                username: "@shrek",
                isAnimated: true,
                code: "mult(cos(y),y)",
                comments: "",
            }];

        var userAlbums = [
            {
                name: "my images",
                images: userImages,
                createdAt: new Date().toDateString(),
                caption: "best album ever"
            },
            {
                name: "my favorites",
                images: userImages,
                createdAt: new Date().toDateString(),
                caption: "my favorite images to date"
            }
        ];

        var userInfo = {
            user: user,
            userImages: userImages,
            userAlbums: userAlbums
        }
        res.json(userInfo);
    })

    // Handles any requests that don't match the ones above
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '../public/index.html'));
    });


    // --------------------------------------------------
    // Path: /api
    //   Dynamic content distribution - return raw data through AJAX
    const api = require('./api');
    app.post('/api', function (req, res) { api.run(req.body, req, res); });
    app.get('/api', function (req, res) { api.run(req.query, req, res); });
    
      require('./userRouter')(app, database);
      require('./challengesRouter')(app, database);
      require('./indexRouter')(app, database);
      require('./galleryRouter')(app, database);
      require('./albumsRouter')(app, database);
      require('./imageRouter')(app, database); 

    // --------------------------------------------------
    // Path: /create
    //   Page for creating an image
    app.get('/api/create', function (req, res) {

    });
}; */
