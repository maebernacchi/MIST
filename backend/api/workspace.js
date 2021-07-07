const handlers = require("./api");
// +--------------------+----------------------------------------------
// | Workspace Handlers |
// +--------------------+

/**
 * Check if an workspace exists
 *   info.action: wsexists
 *   info.title: The title of the image
 */
handlers.workspaceExists = function (info, request, response) {
	const next = () => {
		database
			.workspaceExists(request.user._id, info.name)
			.then((exists) =>
				dispatchResponse(response, "success", undefined, { exists: exists })
			)
			.catch((err) =>
				dispatchResponse(
					response,
					"error",
					500,
					undefined,
					`Server Error: ${err}`
				)
			);
	};
	checkAuthentication(request, response, next);
};

/**
 * Get workspaces
 *  info.action: getws
 *  info.
 */
handlers.getWorkspaces = function (info, req, res) {
	const next = () => {
		database
			.getWorkspaces(req.user._id)
			.then(({ workspaces }) =>
				dispatchResponse(res, "success", undefined, { workspaces: workspaces })
			)
			.catch((err) =>
				dispatchResponse(res, "error", 500, undefined, `Server Error: ${err}`)
			);
	};
	checkAuthentication(req, res, next);
};

/**
 * Save a workspace.
 *   action: savews
 *   workspace: { name: String, data: Object }
 * Precondition:
 * The user does not already own a workspace by the same name.
 */
handlers.saveWorkspace = async function (info, req, res) {
	const next = () => {
		const workspace = info.workspace;
		database
			.saveWorkspace(req.user._id, workspace)
			.then(() => dispatchResponse(res, "success", undefined, null))
			.catch((err) =>
				dispatchResponse(res, "error", 500, undefined, `Server Error: ${err}`)
			);
	};
	checkAuthentication(req, res, next);
}; // handlers.saveWorkspace

handlers.deleteWorkspace = async function (info, req, res) {
	const next = () => {
		database
			.deleteWorkspace(req.user._id, info.name)
			.then(() => dispatchResponse(res, "success", undefined, null))
			.catch((err) =>
				dispatchResponse(res, "error", 500, undefined, `Server Error: ${err}`)
			);
	};
	checkAuthentication(req, res, next);
};


// +-----------+------------------------------------------------------
// | Expert UI |
// +-----------+

handlers.expertwsexists = function (info, req, res) {
	if (!req.isAuthenticated())
		res.json({ success: false, message: "You need to be logged in!" });
	else {
		const userId = req.user._id;
		const name = info.name;
		database.userHasWorkspace(userId, name, res);
	}
};

handlers.saveexpertws = function (info, req, res) {
	if (!req.isAuthenticated())
		res.json({ success: false, message: "You need to be logged in!" });
	else {
		const userId = req.user._id;
		const workspace = info.workspace;
		database.saveExpertWorkspace(userId, workspace, res);
	}
};

handlers.deleteexpertws = function (info, req, res) {
	if (!req.isAuthenticated())
		res.json({ success: false, message: "You need to be logged in!" });
	else {
		const userId = req.user._id;
		const workspace_name = info.name;
		database.deleteexpertws(userId, workspace_name, res);
	}
};

handlers.getUserExpertWS = function (info, req, res) {
	if (!req.isAuthenticated())
		res.json({ success: false, message: "You need to be logged in!" });
	else {
		const userId = req.user._id;
		database.getUserExpertWS(userId, res);
	}
};