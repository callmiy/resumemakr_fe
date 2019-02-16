import React from "react";
import { RouteProps, Route, Redirect } from "react-router-dom";

import { createLoginRoute } from "../routing";
import { UserLocalGqlData } from "../State/auth.local.query";

interface Props extends RouteProps, UserLocalGqlData {
  component: React.ComponentClass<{}> | React.StatelessComponent<{}>;
}

export function AuthRequired({ component: AuthComponent, ...rest }: Props) {
  if (rest.user) {
    return (
      <Route
        {...rest}
        render={function render(childProps: RouteProps) {
          return <AuthComponent {...rest} {...childProps} />;
        }}
      />
    );
  }

  return <Redirect to={createLoginRoute()} />;
}

export default AuthRequired;
