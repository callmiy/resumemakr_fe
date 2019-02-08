import React from "react";

import { AppContainer, AppMain } from "../styles/mixins";
import Header from "../Header";

export function NotFound() {
  return (
    <AppContainer>
      <Header />

      <AppMain style={{ textAlign: "center", marginTop: "60px" }}>
        The page you requested does not exist
      </AppMain>
    </AppContainer>
  );
}

export default NotFound;
