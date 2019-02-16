import React from "react";
import { RouteComponentProps } from "react-router-dom";
// import { CSSTransition, TransitionGroup } from "react-transition-group";

import { AppContainer } from "../styles/mixins";
import Header from "../Header";
import { AuthPathMatch } from "../routing";

interface Merkmale extends RouteComponentProps<AuthPathMatch> {
  // tslint:disable-next-line: no-any
  component: React.LazyExoticComponent<any>;
}

export function Auth(merkmale: Merkmale) {
  const { component: Component, ...others } = merkmale;

  return (
    <AppContainer>
      <Header />

      <Component {...others} />
    </AppContainer>
  );
}

export default Auth;
