const path = require("path");
const database = require('./database');
const api = require('./api');

module.exports = (app, passport, database) => {

    //------------------------------------------------	
    // HOME	

    app.get('/api/home', function (req, res) {

        database.getFeaturedImagesLoggedOut(4, (images, error) => {
            if (error) {
                console.log(error);
                res.json([]);
            } else if (!images) res.json([]);
            else res.json(images);
        })
    });

    //------------------------------------------------	
    // GALLERY	

    app.get('/api/gallery/random', (req, res) => {

        database.getRandomImagesLoggedOut(9, (images, error) => {
            if (error) {
                console.log(error);
                res.json([]);
            } else if (!images) res.json([]);
            else res.json(images);
        })
    })

    app.get('/api/gallery/recent', (req, res) => {

        database.getRecentImagesLoggedOut(9, 1, (images, error) => {
            if (error) {
                console.log(error);
                res.json([]);
            } else if (!images) res.json([]);
            else res.json(images);
        })
    })

    app.get('/api/gallery/featured', (req, res) => {

        database.getFeaturedImagesLoggedOut(9, (images, error) => {
            if (error) {
                console.log(error);
                res.json([]);
            } else if (!images) res.json([]);
            else res.json(images);
        })
    })

    app.get('/api/gallery/top-rated', (req, res) => {

        database.getTopRatedLoggedOut(9, 1, (images, error) => {
            if (error) {
                console.log(error);
                res.json([]);
            } else if (!images) res.json([]);
            else res.json(images);
        })
    })

    app.post('/api/gallery', (req, res) => {
        database.saveComment(req, res);
    })

    //------------------------------------------------	
    // CHALLENGES    	

    app.get('/api/challenges/', (req, res) => {

        // grab URL parameters 	
        let search = req.query.level + ', ' +
            req.query.color + ', ' + req.query.animation;

        database.getChallenges(search, (challenges, error) => {
            if (error) {
                console.log(error);
                res.json([]);
            } else if (!challenges) res.json([]);
            else res.json(challenges);
        })
    })


    //------------------------------------------------	
    // SIGN UP	

    app.post("/api/signup", (req, res) => {
        database.createUser(req, (message) => res.json(message))
    });

    //------------------------------------------------
    // LOGIN

    app.post("/api/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                throw err;
            }
            if (!user) {
                var message = "No User Exists";
                res.json(message);
            }
            else {
                req.logIn(user, (err) => {
                    if (err) throw err;
                    var message = "Success";
                    res.json(message);
                });
            }
        })(req, res, next);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.json("Success");
    })

    app.get("/api/user", (req, res) => {
        if (!req.user) res.json(null);
        else {
            user = req.user;
            res.json(user);
        }
    });

    //------------------------------------------------	
    // IMAGE	

    app.get("/api/img", (req, res) => {
        database.getComments(req.query.id, (comments, error) => {
            if (error) {
                console.log(error);
                res.json([]);
            } else if (!comments) res.json([]);
            else res.json(comments);
        })

    });


    //------------------------------------------------	                
    // FAKE DATA    	

    // Check whether user is signed in	
    app.get('/api/getIsSignedIn', (req, res) => {
        var isSignedIn = false;
        res.json(isSignedIn);
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

    // --------------------------------------------------	
    // Path: /api	
    //   Dynamic content distribution - return raw data through AJAX	
    //const api = require('./api');	
    app.post('/api', function (req, res) { api.run(req.body, req, res); });
    app.get('/api', function (req, res) { api.run(req.query, req, res); });


    // Handles any requests that don't match the ones above	
    app.get('*', (req, res) => {
        console.log('hello')
        //res.sendFile(path.join(__dirname + '../../frontend/public/index.html'));	
    });


    // --------------------------------------------------	
    // Path: /create	
    //   Page for creating an image	
    app.get('/api/create', function (req, res) {

    });

    // Handles any requests that don't match the ones above	
    app.get('*', (req, res) => {
        //res.sendFile(path.join(__dirname + '../../frontend/public/index.html'));	
    });
}	
