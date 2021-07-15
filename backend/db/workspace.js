// +-----------+-------------------------------------------------
// | Workspace |
// +-----------+
module.exports.saveWorkspace = async (userId, workspace) => {
    const bulkWriteOpResult = await User.bulkWrite(
      [
        {
          updateOne: {
            filter: {
              _id: mongoose.Types.ObjectId(userId),
              "workspaces.name": workspace.name,
            },
            update: { "workspaces.$.data": workspace.data },
          },
        },
        {
          updateOne: {
            filter: {
              _id: mongoose.Types.ObjectId(userId),
              "workspaces.name": { $ne: workspace.name },
            },
            update: { $push: { workspaces: new Workspace(workspace) } },
          },
        },
      ],
      { ordered: true }
    );
    if (bulkWriteOpResult.nMatched === 0) {
      throw "Error Unknown";
    }
    if (bulkWriteOpResult.nModified === 0) {
      throw "Error Unknown";
    } 
  }
  
  /**
   * Retrieves the workspaces corresponding to userid
   * We assume that userid corresponds to a user existing in the database
   */
  module.exports.getWorkspaces = async (userid) =>
    User.findById(userid).select("workspaces.data workspaces.name").exec();
  
  /**
   * Checks if the user corresponding to userid has a workspace by the
   * name wsname. We assume that userid corresponds to an existing and active
   * user in the database
   *
   */
  module.exports.workspaceExists = async (userid, wsname) => (
    User.findOne({
      _id: mongoose.Types.ObjectId(userid),
      "workspaces.name": wsname,
    })
      .countDocuments()
      .exec()
  )
  
  module.exports.deleteWorkspace = async (userId, workspace_name) => (
    User.findOne({ _id: mongoose.Types.ObjectId(userId) })
      .updateOne({
        $pull: { workspaces: { name: workspace_name } },
      })
      .exec()
  )


  // +--------------+-------------------------------------------------
// |    Expert    |
// +--------------+

/*
 * Check if the user corresponding to userId has an expertWorkspace with the
 * name of expertWorkspaceName.
 *
 * If user is successfully identified returns
 * {
 *  success: true,
 *  hasWorkspace: ...,
 * }
 * where hasWorkspace is true if the user has an expertWorkspace with the name
 * expertWorkspaceName otherwise false.
 *
 * If user is not successfully identified, returns
 * {
 *  success: false,
 *  message: ...,
 * }
 * where message is the message is our error message.
 */
module.exports.userHasWorkspace = (userId, expertWorkspaceName, res) => {
    const handleSuccess = (user) => {
      if (!user) {
        res.send({
          success: false,
          message: "User could not be located in the database",
        });
      } else {
        if (!user.expertWorkspaces) {
          res.send({
            success: true,
            hasWorkspace: false,
          });
        } else {
          let match = false;
          user.expertWorkspaces.forEach((expertWorkspace) => {
            if (expertWorkspace.name === expertWorkspaceName) {
              match = true;
              return;
            }
          });
          // if no workspace is matched
          res.send({
            success: true,
            hasWorkspace: match,
          });
        }
      }
    };
    const handleError = (error) => {
      res.status(400).send({
        success: false,
        message: "Failed to check due to " + error,
      });
    };
    User.findById(userId)
      .select("expertWorkspaces")
      .exec((error, user) => {
        if (error) handleError(error);
        else handleSuccess(user);
      });
  };
  
  /*
   * saves an expert workspace following the suggestion in the link below
   * https://stackoverflow.com/questions/32549326/mongoose-push-or-replace-element-into-array
   *
   * If successful, returns
   * {
   *  success: true
   * }
   *
   * Otherwise, returns
   * {
   *  success: false,
   *  message: ....
   * }
   * where message, is our error message
   *
   */
  module.exports.saveExpertWorkspace = (userId, workspace, res) => {
    var bulk = User.collection.initializeOrderedBulkOp();
  
    bulk
      .find({
        _id: mongoose.Types.ObjectId(userId),
        "expertWorkspaces.name": workspace.name,
      })
      .updateOne({
        $set: { "expertWorkspaces.$": workspace },
      });
  
    bulk
      .find({
        _id: mongoose.Types.ObjectId(userId),
        "expertWorkspaces.name": { $ne: workspace.name },
      })
      .updateOne({
        $push: { expertWorkspaces: workspace },
      });
    bulk.execute((error, result) => {
      if (error) {
        res.status(400).send({
          success: false,
          message:
            "Error failed to save expert-workspace because of Error: " + error,
        });
      } else {
        if (result.nMatched === 0) {
          // chose nMatched because somehow Mongo was choosing
          // to not modify a document and array if the object inserted
          // is not different from what was already in the array.
          // so we assume that when we have a match the update
          // worked successfully
          res.json({
            success: false,
            message: "Error: Unknown",
          });
        } else {
          res.json({
            success: true,
          });
        }
      }
    });
  };
  
  /*
   * deletes an expert workspace
   *
   * If successful, returns
   * {
   *  success: true
   * }
   *
   * Otherwise, returns
   * {
   *  success: false,
   *  message: ....
   * }
   * where message, is our error message
   *
   */
  module.exports.deleteexpertws = (userId, workspace_name, res) => {
    User.find({ _id: mongoose.Types.ObjectId(userId) })
      .updateOne({
        $pull: { expertWorkspaces: { name: workspace_name } },
      })
      .exec((error, result) => {
        if (error) {
          res.status(400).send({
            success: false,
            message:
              "Error failed to remove expert-workspace because of Error: " +
              error,
          });
        } else {
          if (result.nMatched === 0) {
            res.json({
              success: false,
              message: "Error: Unknown",
            });
          } else {
            res.json({
              success: true,
            });
          }
        }
      });
  };
  
  module.exports.getUserExpertWS = (userId, res) => {
    User.findById(userId)
      .select("expertWorkspaces")
      .exec()
      .then((user) => {
        if (user) return user.expertWorkspaces;
        else {
          res.json({
            success: false,
            message: "user could not be located in the database",
          });
        }
      })
      .then((expertWorkspaces) => {
        res.send({ success: true, expertWorkspaces: expertWorkspaces });
      })
      .catch((error) =>
        res.json({ success: false, message: "Failed due to Error: " + error })
      );
  };