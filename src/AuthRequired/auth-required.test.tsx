import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";
import { Switch, Route, RouteProps } from "react-router-dom";

import { renderWithRouter } from "../test_utils";
import AuthRequired from "./auth-required-x";
import { UserLocalGqlData } from "../State/auth.local.query";
import { LOGIN_URL } from "../routing";

interface Props extends RouteProps, UserLocalGqlData {}

function App(props: Props = {}) {
  return (
    <Switch>
      <Route path={LOGIN_URL} exact={true} render={() => <div>Login</div>} />

      <AuthRequired
        {...props}
        exact={true}
        path="/my-path"
        component={() => <div>Home</div>}
      />
    </Switch>
  );
}

it("renders auth component when user is not null", () => {
  const { Ui } = renderWithRouter(App, {
    resumeMakrPath: "/my-path"
  });

  const { container } = render(
    <Ui user={{ jwt: "jwt", email: "e", name: "x", id: "id" }} />
  );

  expect(container.innerHTML).toMatch("Home");
});

xit("redirects to login when user is null", () => {
  const { Ui } = renderWithRouter(App, {
    resumeMakrPath: "/my-path"
  });

  const { container } = render(<Ui />);
  expect(container.innerHTML).toMatch("Login");
});
