import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import "semantic-ui-css-offline";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import setUp from "./State/apollo-setup";
import GlobalStyle from "./styles/global-style";

const { persistCache, client } = setUp();

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
