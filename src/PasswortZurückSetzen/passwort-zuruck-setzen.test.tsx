import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, waitForElement, act } from "react-testing-library";

import { PasswortZurückSetzen } from "./passwort-zurück-setzen-x";
import { Merkmale } from "./passwort-zurück-setzen";
import {
  renderWithRouter,
  renderWithApollo,
  fillField,
  WithData
} from "../test_utils";
import { ZURUCK_SETZEN_PFAD_ANFORDERN } from "../routing";
import { AnfordernPasswortZuruckSetzen } from "../graphql/apollo-gql";

const PasswortZurückSetzenTeilweise = PasswortZurückSetzen as React.FunctionComponent<
  Partial<Merkmale>
>;

const anfordernTasteMuster = /Passwortzurücksetzen Anfordern/i;

it("rendern anfordern", async () => {
  const { Ui: ui } = renderWithRouter(PasswortZurückSetzenTeilweise);
  const { Ui } = renderWithApollo(ui);
  const email = "ich@du.com";

  const data: WithData<AnfordernPasswortZuruckSetzen> = {
    data: {
      anfordernPasswortZuruckSetzen: { email }
    }
  };

  const nachgemachtemAnfordernPasswortZuruckSetzen = jest.fn(() =>
    Promise.resolve(data)
  );

  /**
   * Given that user visits page to request password reset token
   */
  const { getByText, queryByText, getByLabelText } = render(
    <Ui
      match={{
        params: { token: ZURUCK_SETZEN_PFAD_ANFORDERN },
        isExact: true,
        path: "",
        url: ""
      }}
      anfordernPasswortZuruckSetzen={nachgemachtemAnfordernPasswortZuruckSetzen}
    />
  );

  /**
   * Dann sieht ihn eine Taste mit Label er kann anfordern machen
   */
  const $taste = getByText(anfordernTasteMuster);
  expect($taste).toBeInTheDocument();

  /**
   * Und das die Taste ist deaktiviert
   */
  expect($taste).toBeDisabled();

  /**
   * But he does not see text showing he can reset his passwort noch
   */
  expect(queryByText(/Zuruck setzen Ihr Passwort/)).not.toBeInTheDocument();

  /**
   * And he does not see a text showing he hat eine ungültige e-mail eingegeben
   */
  const ungültigeMuster = /E-Mail ist ungültig/i;
  expect(queryByText(ungültigeMuster)).not.toBeInTheDocument();

  /**
   * When he enters an invalid email
   */
  const $input = getByLabelText("Geben Sie ihr E-mail Adresse");
  fillField($input, "ungültig-email");

  /**
   * Er merkt das die Taste ist aktiviert
   */
  expect($taste).not.toBeDisabled();

  /**
   * Wan er druck die Taste
   */
  act(() => {
    fireEvent.click($taste);
  });

  /**
   * Dann seht ihn das die e-mail ist falsch
   */
  expect(getByText(ungültigeMuster)).toBeInTheDocument();

  /**
   * Wan er die Eingabe löscht
   */
  act(() => {
    fillField($input, "");
  });

  /**
   * Er merkt das die Falsche Email-Nachrichte is verschwunden
   */
  expect(queryByText(ungültigeMuster)).not.toBeInTheDocument();

  /**
   * Und die Taste is deaktiviert
   */
  expect($taste).toBeDisabled();

  /**
   * Und er kann nicht erfolgreich Nachricht sehen
   */

  const erfolgNachrichtMuster = new RegExp(
    `Wir haben nach Ihr E-mail Adress ${email}`,
    "i"
  );

  expect(queryByText(erfolgNachrichtMuster)).not.toBeInTheDocument();

  /**
   * Wan er gibt die richtige E-mail Adress ins the Eingabe in
   */

  act(() => {
    fillField($input, email);
  });

  /**
   * Er merkt dass die Taste is aktiviert
   */
  expect($taste).not.toBeDisabled();

  /**
   * Wann er hat die formular eingereicht
   */

  act(() => {
    fireEvent.click($taste);
  });

  /**
   * Er merkt dass die Taste wird geladen
   */
  expect($taste).toHaveClass("loading");

  /**
   * Und dass die Taste ist deaktiviert
   */
  expect($taste).toBeDisabled();

  /**
   * Dann kan er das erfolgereich Nachrichten sehen
   */
  expect(nachgemachtemAnfordernPasswortZuruckSetzen).toBeCalledWith({
    variables: { email }
  });

  const $el = await waitForElement(() => getByText(erfolgNachrichtMuster));

  expect($el).toBeInTheDocument();
});

it("rendern andern", () => {
  const { Ui: ui } = renderWithRouter(PasswortZurückSetzenTeilweise);
  const { Ui } = renderWithApollo(ui);

  const { getByText, queryByText } = render(
    <Ui
      match={{
        params: { token: "valid token" },
        isExact: true,
        path: "",
        url: ""
      }}
    />
  );

  expect(queryByText(anfordernTasteMuster)).not.toBeInTheDocument();

  expect(getByText(/Zuruck setzen Ihr Passwort/)).toBeInTheDocument();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
