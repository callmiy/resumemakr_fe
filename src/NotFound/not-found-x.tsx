import React from "react";
import "styled-components/macro";

import { AppContainer, AppMain } from "../styles/mixins";
import Header from "../Header";

export function NotFound() {
  return (
    <AppContainer>
      <Header />

      <AppMain
        css={`
          text-align: center;
          margin-top: 60px;
        `}
      >
        The page you requested does not exist
      </AppMain>
    </AppContainer>
  );
}

export default NotFound;
