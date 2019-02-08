import React, { useState } from "react";
import { FastField, FieldProps, FormikErrors } from "formik";
import {
  Form,
  Card,
  Button,
  Icon,
  Input,
  InputOnChangeData,
  Message
} from "semantic-ui-react";
import lodashIsEmpty from "lodash/isEmpty";
import { CSSTransition } from "react-transition-group";

import {
  Merkmale,
  FORMULAR_RENDERN_MARKMALE,
  emailValidator
} from "./passwort-zurück-setzen";
import { LOGIN_URL, ZURUCK_SETZEN_PFAD_ANFORDERN } from "../routing";
import Header from "../Header";
import { BerechtigungHaupanwendung, BerechtigungKarte } from "../styles/mixins";
import {
  Behalter,
  FormularBereich,
  anfordernFormularZeit,
  anfordernNachrichtZeit
} from "./passwort-zurück-setzen.styles";
import { VeranderungPasswortZuruckSetzenInput } from "../graphql/apollo-gql";
import { ApolloError } from "apollo-client";

export function PasswortZurückSetzen(merkmale: Merkmale) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [wirdGeladen, setWirdGeladen] = useState<boolean>(false);
  const [andernFormikFehler, estellenAndernFormikFehler] = useState<
    undefined | FormikErrors<VeranderungPasswortZuruckSetzenInput>
  >(undefined);

  const [erfolgNachricht, einstellenErfolgNachricht] = useState<
    JSX.Element | undefined
  >(undefined);

  const [emailGqlFehler, einstellenGqlFehler] = useState<
    ApolloError | undefined
  >(undefined);

  const [andererFehlerNachrichte, einstellenAndererFehlerNachrichte] = useState<
    string | undefined
  >(undefined);

  function rendernAndern() {
    const {
      dirty: schmutzig,
      isSubmitting: istEinreichen,
      setSubmitting,
      values,
      validateForm
    } = merkmale;

    const { history: verlauf } = merkmale;

    return (
      <BerechtigungKarte>
        <Card.Content className="berechtigung-karte__intro" extra={true}>
          Zuruck setzen Ihr Passwort
        </Card.Content>

        {erfolgNachricht && erfolgNachricht}

        <Card.Content>
          <Form
            onSubmit={async () => {
              setSubmitting(true);
              estellenAndernFormikFehler(undefined);

              const errors = await validateForm(values);

              if (!lodashIsEmpty(errors)) {
                estellenAndernFormikFehler(errors);
                setSubmitting(false);

                return;
              }

              const { passwortZuruckSetzenVeranderung } = merkmale;

              if (!passwortZuruckSetzenVeranderung) {
                einstellenAndererFehlerNachrichte(
                  "Es gibt ein Fehler. Die Anforderung kann nicht gestellt werden"
                );

                setSubmitting(false);
                return;
              }

              try {
                const erfolg = await passwortZuruckSetzenVeranderung({
                  variables: {
                    input: values
                  }
                });

                const benutzer =
                  erfolg &&
                  erfolg.data &&
                  erfolg.data.veranderungPasswortZuruckSetzen &&
                  erfolg.data.veranderungPasswortZuruckSetzen.user;

                if (!benutzer) {
                  return;
                }

                einstellenErfolgNachricht(
                  <Message success={true}>
                    <Message.Header>
                      Passwortzurücksetzen erfolgreich
                    </Message.Header>
                  </Message>
                );
              } catch (error) {
                einstellenGqlFehler(error);
                setSubmitting(false);
              }
            }}
          >
            {Object.entries(FORMULAR_RENDERN_MARKMALE).map(
              ([name, [label, type]]) => {
                return (
                  <FastField
                    key={name}
                    name={name}
                    render={rendernEingabe(label, type)}
                  />
                );
              }
            )}

            <Button
              id="passwort-zuruck-einreichen"
              name="passwort-zuruck-einreichen"
              color="green"
              inverted={true}
              disabled={!schmutzig || istEinreichen}
              loading={istEinreichen}
              type="submit"
              fluid={true}
            >
              <Icon name="checkmark" /> Einreichen
            </Button>
          </Form>
        </Card.Content>

        <Card.Content className="berechtigung-karte__intro" extra={true}>
          <Button
            className="to-login-button"
            type="button"
            fluid={true}
            onClick={() => verlauf.replace(LOGIN_URL)}
            disabled={istEinreichen}
          >
            Klicken Sie hier um sich anzumelden
          </Button>
        </Card.Content>
      </BerechtigungKarte>
    );
  }

  function rendernEingabe(label: string, typ: string) {
    return function rendernEingabeDrinnen(
      formularMarkmale: FieldProps<VeranderungPasswortZuruckSetzenInput>
    ) {
      const { field: bereich } = formularMarkmale;
      const { name } = bereich;
      const istVersteckt = name === "token";
      const fehler =
        !istVersteckt && andernFormikFehler && andernFormikFehler[name];

      return (
        <FormularBereich istVersteckt={istVersteckt}>
          <Form.Field>
            <label htmlFor={name}>{label}</label>

            <Input
              {...bereich}
              autoComplete="off"
              type={typ}
              id={name}
              autoFocus={name === "password"}
            />

            {fehler && <div className="email-error">{fehler}</div>}
          </Form.Field>
        </FormularBereich>
      );
    };
  }

  async function einreichenAnfordernFormular() {
    setWirdGeladen(true);
    einstellenAndererFehlerNachrichte(undefined);
    einstellenGqlFehler(undefined);
    setEmailError(undefined);

    const data = email.trim();

    try {
      emailValidator.validateSync(data);
    } catch (error) {
      setEmailError(error.message);
      setWirdGeladen(false);
      setEmailError(error.message);
      return;
    }

    const { anfordernPasswortZuruckSetzen } = merkmale;

    if (!anfordernPasswortZuruckSetzen) {
      einstellenAndererFehlerNachrichte(
        "Es gibt ein Fehler. Die Anforderung kann nicht gestellt werden"
      );
      return;
    }

    try {
      const erfolg = await anfordernPasswortZuruckSetzen({
        variables: {
          email: email.trim()
        }
      });

      setWirdGeladen(false);

      const serverEmail =
        erfolg &&
        erfolg.data &&
        erfolg.data.anfordernPasswortZuruckSetzen &&
        erfolg.data.anfordernPasswortZuruckSetzen.email;

      if (!serverEmail) {
        einstellenAndererFehlerNachrichte(
          "Es gibt ein Fehler. Die Anforderung kann nicht gestellt werden"
        );
        return;
      }

      einstellenErfolgNachricht(
        <div>
          Wir haben nach Ihr E-mail Adress {serverEmail} ein Link zum passwort
          zuruck setzen geschickt. Klicken Sie auf dem Link.
        </div>
      );
    } catch (fehler) {
      einstellenGqlFehler(fehler);
      setWirdGeladen(false);
    }
  }

  function rendenAnfordernFormular() {
    const hatFehler = !!email.trim() && !!emailError;
    const istFormular = !erfolgNachricht;

    return (
      <>
        <CSSTransition
          timeout={anfordernFormularZeit}
          classNames="pzs__anfordern-formular--animate"
          in={istFormular}
          unmountOnExit={true}
        >
          <BerechtigungKarte
            className="anfordern"
            data-testid="pzs__anfordern-formular"
          >
            <Card.Content className="anfordern__intro" extra={true}>
              <span>
                Geben Sie Ihr E-mail Adresse ein und Sie erhalten einen Link, um
                das passwortzurücksetzen.
              </span>
            </Card.Content>

            <Card.Content>
              <Form onSubmit={einreichenAnfordernFormular}>
                <Form.Field error={hatFehler}>
                  {andererFehlerNachrichte && (
                    <div className="email-error ">
                      {andererFehlerNachrichte}
                    </div>
                  )}

                  {emailGqlFehler && (
                    <Message
                      negative={true}
                      onDismiss={() => einstellenGqlFehler(undefined)}
                    >
                      <div>{emailGqlFehler.graphQLErrors[0].message}</div>
                    </Message>
                  )}

                  <label
                    htmlFor="passwort-zuruck-setzen-anfordern"
                    className="pzs__anfordern-etikett"
                  >
                    Geben Sie ihr E-mail Adresse
                  </label>
                  <Input
                    name="passwort-zuruck-setzen-anfordern"
                    id="passwort-zuruck-setzen-anfordern"
                    autoComplete="off"
                    onChange={(
                      evt: React.ChangeEvent<HTMLInputElement>,
                      data: InputOnChangeData
                    ) => {
                      const { value } = data;
                      setEmail(value);
                      if (emailError && !value.trim()) {
                        setEmailError(undefined);
                      }
                    }}
                    autoFocus={true}
                  />
                  {hatFehler && <div className="email-error">{emailError}</div>}
                </Form.Field>

                <Button
                  className="anfordern__btn"
                  id="passwort-zuruck-bitten"
                  name="passwort-zuruck-bitten"
                  color="green"
                  inverted={true}
                  disabled={wirdGeladen || !email.trim()}
                  loading={wirdGeladen}
                  type="submit"
                  fluid={true}
                >
                  <Icon name="checkmark" /> Passwortzurücksetzen Anfordern
                </Button>
              </Form>
            </Card.Content>
          </BerechtigungKarte>
        </CSSTransition>

        {!istFormular && (
          <CSSTransition
            classNames="pzs__anfordern-nachricht--animate"
            timeout={anfordernNachrichtZeit}
            appear={true}
            in={!istFormular}
          >
            <div className="pzs__anfordern-nachricht anfordern">
              <Message
                icon={true}
                success={true}
                style={{ marginBottom: "60px" }}
              >
                <Icon name="checkmark" />

                <Message.Content>
                  <Message.Header>{erfolgNachricht}</Message.Header>
                </Message.Content>
              </Message>

              {einloggenTaste()}
            </div>
          </CSSTransition>
        )}
      </>
    );
  }

  function einloggenTaste() {
    return (
      <div className="pzs__anfordern-nachricht__zu-einloggin">
        <Button
          primary={true}
          type="button"
          onClick={() => merkmale.history.replace(LOGIN_URL)}
        >
          Klicken Sie hier um sich anzumelden
        </Button>
      </div>
    );
  }

  const {
    match: {
      params: { token }
    },
    pzsTokenKontrollieren
  } = merkmale;

  if (token !== ZURUCK_SETZEN_PFAD_ANFORDERN && !pzsTokenKontrollieren) {
    return (
      <Behalter>
        <Header />

        <BerechtigungHaupanwendung>
          <div className="pzs__anfordern-nachricht anfordern">
            <Message
              warning={true}
              icon={true}
              style={{ marginBottom: "60px" }}
            >
              <Icon name="ban" />

              <Message.Content>
                <Message.Header> Die Token ist falsch </Message.Header>
              </Message.Content>
            </Message>

            {einloggenTaste()}
          </div>
        </BerechtigungHaupanwendung>
      </Behalter>
    );
  }

  return (
    <Behalter>
      <Header />

      <BerechtigungHaupanwendung>
        {token === ZURUCK_SETZEN_PFAD_ANFORDERN
          ? rendenAnfordernFormular()
          : rendernAndern()}
      </BerechtigungHaupanwendung>
    </Behalter>
  );
}

export default PasswortZurückSetzen;
