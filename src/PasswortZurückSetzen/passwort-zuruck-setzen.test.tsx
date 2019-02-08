import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, waitForElement, act } from "react-testing-library";
import { withFormik } from "formik";

import { PasswortZurückSetzen } from "./passwort-zurück-setzen-x";
import { Merkmale, formikConfig } from "./passwort-zurück-setzen";
import {
  renderWithRouter,
  renderWithApollo,
  fillField,
  WithData
} from "../test_utils";
import { ZURUCK_SETZEN_PFAD_ANFORDERN } from "../routing";
import {
  AnfordernPasswortZuruckSetzen,
  PasswortZuruckSetzenVeranderung,
  PasswortZuruckSetzenVeranderung_veranderungPasswortZuruckSetzen_user,
  AktualisierenAbfrage_refreshUser
} from "../graphql/apollo-gql";
import { GraphQLError } from "graphql";
import { ApolloError } from "apollo-client";
import { passworteNichtGleich } from "../SignUp/sign-up";

type M = React.FunctionComponent<Partial<Merkmale>>;
const PasswortZurückSetzenTeilweise = PasswortZurückSetzen as M;

const anfordernTasteMuster = /Passwortzurücksetzen Anfordern/i;
const andernTasteMuster = /Einreichen/i;
const passworteNichtGleichMuster = new RegExp(passworteNichtGleich, "i");

jest.mock("react-transition-group", () => {
  const FakeTransition = jest.fn(({ children }) => children);

  const FakeCSSTransition = jest.fn(props =>
    props.in ? <FakeTransition>{props.children}</FakeTransition> : null
  );

  return { CSSTransition: FakeCSSTransition, TransitionGroup: FakeTransition };
});

it("rendern anfordern erfolgreich gluck pfad", async () => {
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
  const { getByText, queryByText, getByLabelText, queryByTestId } = render(
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
   * Und dass die Taste ist deaktiviert
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
   * Dann kann er das erfolgereich Nachrichten sehen
   */
  expect(nachgemachtemAnfordernPasswortZuruckSetzen).toBeCalledWith({
    variables: { email }
  });

  const $el = await waitForElement(() => getByText(erfolgNachrichtMuster));

  expect($el).toBeInTheDocument();

  /**
   * Und er kann nicht die Formular sehen
   */
  expect(queryByTestId("pzs__anfordern-formular")).not.toBeInTheDocument();
});

it("Anfordern formular is nicht rendert wenn token is falsch", () => {
  const { Ui: ui } = renderWithRouter(PasswortZurückSetzenTeilweise);
  const { Ui } = renderWithApollo(ui);

  /**
   * Wann man komm bei anfordern passwortzurücksetzen an
   */
  const { getByText, queryByText } = render(
    <Ui
      match={{
        params: { token: "falsche Token" },
        isExact: true,
        path: "",
        url: ""
      }}
      refreshUser={null}
    />
  );

  /**
   * Dann sieht er dass die Anfordernseite is versteckt
   */

  expect(queryByText(anfordernTasteMuster)).not.toBeInTheDocument();

  /**
   * Und kein Nachricht dass er kann passwortzurücksetzen machen
   */
  expect(queryByText(/Zuruck setzen Ihr Passwort/)).not.toBeInTheDocument();

  /**
   * Und er sieht ein nachricht dass die Token ist falsch
   */
  expect(getByText(/Die Token ist falsch/i)).toBeInTheDocument();
});

it("eine apollo fehler rendert", async () => {
  const { Ui: ui } = renderWithRouter(PasswortZurückSetzenTeilweise);
  const { Ui } = renderWithApollo(ui);
  const email = "ich@du.com";
  const angelehntNachricht = `Unknown user email: ${email}`;
  const gqlFehler = new ApolloError({
    graphQLErrors: [new GraphQLError(angelehntNachricht)]
  });

  const nachgemachtemAnfordernPasswortZuruckSetzen = jest.fn(() =>
    Promise.reject(gqlFehler)
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
   * Er merkt dass kein Nachricht dass sein E-mail ist angelehnt
   */
  expect(queryByText(angelehntNachricht)).not.toBeInTheDocument();

  /**
   * Wann er gebt sein E-mail Adress ein
   */

  fillField(getByLabelText("Geben Sie ihr E-mail Adresse"), email);

  /**
   * Und klicken die Taste
   */
  fireEvent.click(getByText(anfordernTasteMuster));

  /**
   * Dann erfordert die Nachricht dass die Email ist angelehnt
   */
  const angelehntNachrichtMuster = new RegExp(angelehntNachricht, "i");
  const $el = await waitForElement(() => getByText(angelehntNachrichtMuster));
  expect($el).toBeInTheDocument();

  /**
   * Wann klickt er die Taste das angelehntachricht
   */
  fireEvent.click(($el.parentNode as HTMLElement).querySelector(
    ".close.icon"
  ) as HTMLElement);

  /**
   * Dann die angelehntnachricht soll verschwinden
   */
  expect(queryByText(angelehntNachrichtMuster)).not.toBeInTheDocument();
});

it("rendern andern - glücklich Pfad", async () => {
  const { Ui: ui1 } = renderWithRouter(PasswortZurückSetzenTeilweise);
  const { Ui: ui2 } = renderWithApollo(ui1);
  const Ui = withFormik(formikConfig)(ui2) as M;

  const data: WithData<PasswortZuruckSetzenVeranderung> = {
    data: {
      veranderungPasswortZuruckSetzen: {
        user: {} as PasswortZuruckSetzenVeranderung_veranderungPasswortZuruckSetzen_user
      }
    }
  };

  const nachgemachtemPasswortZuruckVeranderung = jest.fn(() =>
    Promise.resolve(data)
  );

  const token = "valid token";

  /**
   * Wann man besucht das Andern Seite
   */
  const { getByText, queryByText, getByLabelText } = render(
    <Ui
      match={{
        params: { token },
        isExact: true,
        path: "",
        url: ""
      }}
      passwortZuruckSetzenVeranderung={nachgemachtemPasswortZuruckVeranderung}
      refreshUser={{} as AktualisierenAbfrage_refreshUser}
    />
  );

  /**
   * Dann sieht er dass die Anfordernseite is versteckt
   */

  expect(queryByText(anfordernTasteMuster)).not.toBeInTheDocument();

  /**
   * Und das die andern taste ist deaktiviert
   */

  const $taste = getByText(andernTasteMuster);
  expect($taste).toBeDisabled();

  /**
   * Wann er gebt die Formular ein
   */
  const $passwortEingabe = getByLabelText("Passwort");
  fillField($passwortEingabe, "passwort");

  /**
   * Dann er sieht dass the andern Taste ist aktiviert
   */
  expect($taste).not.toBeDisabled();

  /**
   * Wann er mach die Formular leer
   */
  fillField($passwortEingabe, "");

  /**
   * dann die andern taste ist deaktiviert
   */
  expect($taste).toBeDisabled();

  /**
   * Und das eine Nachricht dass passworte nicht gleich nicht aus die Seite
   */
  expect(queryByText(passworteNichtGleichMuster)).not.toBeInTheDocument();

  /**
   * Wann er gebt die Formular ein, aber passwort und bestätigen passwort nicht
   * gleich
   */
  const passwort = "passwort";
  fillField($passwortEingabe, passwort);
  const $passwortBestätigen = getByLabelText("Passwort Bestätigen");
  fillField($passwortBestätigen, "passwort1");

  /**
   * Und er hat die Taste eingereicht
   */

  fireEvent.click($taste);

  /**
   * Dann sieht er ein Nachricht dass passworte nicht gleich
   */

  let $el = await waitForElement(() => getByText(passworteNichtGleichMuster));
  expect($el).toBeInTheDocument();

  /**
   * Wann die Formular ist richtige fühlen
   */
  fillField($passwortEingabe, passwort);
  fillField($passwortBestätigen, passwort);

  /**
   * Und er hat die Taste eingereicht
   */

  fireEvent.click($taste);

  /**
   * Dann sieht er dass Nachrichte das alles ist erfolgreich
   */
  $el = await waitForElement(() =>
    getByText(/Passwortzurücksetzen erfolgreich/i)
  );
  expect($el).toBeInTheDocument();

  expect(nachgemachtemPasswortZuruckVeranderung).toBeCalledWith({
    variables: {
      input: {
        password: passwort,
        passwordConfirmation: passwort,
        token
      }
    }
  });
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
