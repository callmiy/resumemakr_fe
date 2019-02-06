import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";

import { PasswortZurückSetzen } from "./passwort-zurück-setzen-x";
import { Merkmale } from "./passwort-zurück-setzen";
import { renderWithRouter } from "../test_utils";
import { ZURUCK_SETZEN_PFAD_ANFORDERN } from "../routing";

const PasswortZurückSetzenTeilweise = PasswortZurückSetzen as React.ComponentClass<
  Partial<Merkmale>
>;

it("rendern anfordern", () => {
  const { getByText } = render(
    <PasswortZurückSetzenTeilweise
      match={{
        params: { token: ZURUCK_SETZEN_PFAD_ANFORDERN },
        isExact: true,
        path: "",
        url: ""
      }}
    />
  );

  expect(getByText(/Passwortzurücksetzen Anfordern/i)).toBeInTheDOM();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
