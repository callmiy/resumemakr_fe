import React, { Component } from "react";

import logger from "../logger";
import logo from "./logo.svg";
import "./app.scss";

class App extends Component<{ persistCache: () => void }> {
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
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
