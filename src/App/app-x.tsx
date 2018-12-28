import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./app.scss";
import logger from "../logger";
import Loading from "../Loading";
import { RESUME_PATH } from "../routing";

function Root() {
  return (
    <div className="app-container">
      <div className="app-main">
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
