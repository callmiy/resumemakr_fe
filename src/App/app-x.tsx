import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import logger from "../logger";
import Loading from "../Loading";
import {
  RESUME_PATH,
  ROOT_URL,
  LOGIN_URL,
  SIGN_UP_URL,
  RESET_PATH
} from "../routing";
import AuthRequired from "../AuthRequired";
import { AppContainer } from "../styles/mixins";
import { Props } from "./app";
import Header from "../Header";
import NotFound from "../NotFound";

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
const PasswortZurückSetzen = lazy(() => import("../PasswortZurückSetzen"));

export function App({ persistCache }: Props) {
  const [
    zwischenspeicherHatGeladen,
    einstellenZwischenspeicherHatGeladen
  ] = useState(false);

  useEffect(function zwischenspeicherWirdSpeichert() {
    (async function() {
      try {
        await persistCache();
        einstellenZwischenspeicherHatGeladen(true);
      } catch (error) {
        logger("error", "Error restoring Apollo cache", error);
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<Root />}>
        {zwischenspeicherHatGeladen ? (
          <Switch>
            <AuthRequired exact={true} path={RESUME_PATH} component={Resume} />

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

            <Route
              exact={true}
              path={RESET_PATH}
              render={function renderReset(childProps) {
                return <PasswortZurückSetzen {...childProps} />;
              }}
            />

            <Route component={NotFound} />
          </Switch>
        ) : (
          <Root />
        )}
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
