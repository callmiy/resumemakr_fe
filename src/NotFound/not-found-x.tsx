import React from "react";

import { AppContainer, AppMain1 } from "../styles/mixins";
import Header from "../Header";

export function NotFound() {
  return (
    <AppContainer>
      <Header />

      <AppMain1>The page you requested does not exist</AppMain1>
    </AppContainer>
  );
}

export default NotFound;
