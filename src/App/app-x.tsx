import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import logger from "../logger";
import Loading from "../Loading";
import { RESUME_PATH, ROOT_URL, LOGIN_URL, SIGN_UP_URL } from "../routing";
import AuthRequired from "../AuthRequired";
import { AppContainer } from "../styles/mixins";
import { Props } from "./app";
import Header from "../Header";

function Root() {
  return (
    <AppContainer>
      <Header />
      <Loading />
    </AppContainer>
  );
}

const Resume = lazy(() => import("../Resume"));
const Home = lazy(() => import("../Home"));
const Login = lazy(() => import("../Login"));
const SignUp = lazy(() => import("../SignUp"));

export class App extends Component<Props> {
  state: { cacheLoaded: boolean } = { cacheLoaded: false };

  async componentDidMount() {
    try {
      await this.props.persistCache();
      this.setState({ cacheLoaded: true });
    } catch (error) {
      logger("error", "Error restoring Apollo cache", error);
    }
  }

  render() {
    const { cacheLoaded } = this.state;

    return (
      <BrowserRouter>
        <Suspense fallback={<Root />}>
          {cacheLoaded ? (
            <Switch>
              <AuthRequired
                exact={true}
                path={RESUME_PATH}
                component={Resume}
              />

              <AuthRequired exact={true} path={ROOT_URL} component={Home} />

              {/* we are using render props because react router 4 is not yet
              compatible with react >= 16.7. React router throws invalid props
              error (only in dev) for component prop, but otherwise it
              renders ok
           */}

              <Route
                exact={true}
                path={LOGIN_URL}
                render={function renderLogin(childProps) {
                  return <Login {...childProps} />;
                }}
              />

              <Route
                exact={true}
                path={SIGN_UP_URL}
                render={function renderSignUp(childProps) {
                  return <SignUp {...childProps} />;
                }}
              />

              <Redirect to={LOGIN_URL} />
            </Switch>
          ) : (
            <Root />
          )}
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
