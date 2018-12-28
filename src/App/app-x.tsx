import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import logger from "../logger";
import Loading from "../Loading";
import { RESUME_PATH } from "../routing";
import { FIRST_LEVEL_CLASS, SECOND_LEVEL_CLASS } from "../constants";

function Root() {
  return (
    <div className={FIRST_LEVEL_CLASS}>
      <div className={SECOND_LEVEL_CLASS}>
        {/* <Header title="" /> */}
        <Loading />
      </div>
    </div>
  );
}

const Resume = lazy(() => import("../Resume"));

export class App extends Component<{ persistCache: () => void }> {
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
              <Route
                exact={true}
                path={RESUME_PATH}
                render={function renderCV(childProps) {
                  return <Resume {...childProps} />;
                }}
              />
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
