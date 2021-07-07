// +-----------+------------------------------------------------------
// | Settings  |
// +-----------+

handlers.changeEmail = function (info, req, res) {
	database.changeEmail(req, (message) => res.json(message));
};

handlers.changeUsername = function (info, req, res) {
	database.changeUsername(req, (message) => res.json(message));
};

handlers.changePassword = function (info, req, res) {
	database.changePassword(req, (message) => res.json(message));
};

handlers.deleteAccount = function (info, req, res) {
	database.deleteAccount(req, (message) => {
		req.logout();
		res.json(message);
	});
};

handlers.changeName = function (info, req, res) {
	database.changeName(req, (message) => res.json(message));
};

handlers.changeBio = function (info, req, res) {
	database.changeBio(req, (message) => res.json(message));
};

handlers.changeProfilePic = function (info, req, res) {
	database.changeProfilePic(req, (message) => res.json(message));
};
