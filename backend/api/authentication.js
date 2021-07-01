// https://stackoverflow.com/questions/38820251/how-is-req-isauthenticated-in-passport-js-implemented
function checkAuthentication(request, response, next) {
	if (request.isAuthenticated()) {
		//req.isAuthenticated() will return true if user is logged in
		next();
	} else {
		// This is the jsend response status for rejected API call
		const responseStatus = "fail";
		// This is the unauthorized/unauthenticated HTTP response status code
		const responseStatusCode = 401;
		const data = { Authentication: "You need to be logged in!" };
		dispatchResponse(response, responseStatus, responseStatusCode, data);
	}
}