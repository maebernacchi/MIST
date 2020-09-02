import React from "react";

class emailVerification extends React.Component {
  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "verifyEmail",
        token: params.token,
      }),
    });
  }
  render() {
    return <h1>Email has been verified. Please SignIn to continue!</h1>;
  }
}

export default emailVerification;
