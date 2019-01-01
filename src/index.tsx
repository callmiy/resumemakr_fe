import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { createGlobalStyle } from "styled-components";
import "semantic-ui-css-offline";

import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import setUp from "./State/apollo-setup";

const { persistCache, client } = setUp();

const GlobalStyle = createGlobalStyle`
  ul {
    padding: 0;
    margin: 0;

  
  }

  li{
      list-style-type: none;
    }
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <GlobalStyle />
    <App persistCache={persistCache} />
  </ApolloProvider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
