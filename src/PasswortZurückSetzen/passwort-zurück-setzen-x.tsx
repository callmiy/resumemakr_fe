import React, { useState } from "react";
import { Formik, FormikProps, FastField, FieldProps } from "formik";
import {
  Form,
  Card,
  Button,
  Icon,
  Input,
  InputOnChangeData
} from "semantic-ui-react";

import {
  Merkmale,
  FORMULAR_RENDERN_MARKMALE,
  ValidationSchema,
  emailValidator
} from "./passwort-zurück-setzen";
import { LOGIN_URL, ZURUCK_SETZEN_PFAD_ANFORDERN } from "../routing";
import Header from "../Header";
import { BerechtigungHaupanwendung, BerechtigungKarte } from "../styles/mixins";
import { Behälter, FormularBereich } from "./passwort-zurück-setzen.styles";
import { PasswortZuruckSetzenInput } from "../graphql/apollo-gql";
import { ApolloError } from "apollo-client";

export function PasswortZurückSetzen(merkmale: Merkmale) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [wirdGeladen, setWirdGeladen] = useState<boolean>(false);
  const [erfolgNachricht, einstellenErfolgNachricht] = useState<
    JSX.Element | undefined
  >(undefined);

  const [emailGqlFehler, einstellenGqlFehler] = useState<
    ApolloError | undefined
  >(undefined);

  const [andererFehlerNachrichte, einstellenAndererFehlerNachrichte] = useState<
    string | undefined
  >(undefined);

  function rendernAndern(
    formularMerkmale: FormikProps<PasswortZuruckSetzenInput>
  ) {
    const { dirty: schmutzig, isSubmitting: istEinreichen } = formularMerkmale;
    const { history: verlauf } = merkmale;

    return (
      <BerechtigungKarte>
        <Card.Content className="berechtigung-karte__intro" extra={true}>
          Zuruck setzen Ihr Passwort
        </Card.Content>

        <Card.Content>
          <Form>
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
      formularMarkmale: FieldProps<PasswortZuruckSetzenInput>
    ) {
      const { field: bereich } = formularMarkmale;
      const { name } = bereich;

      return (
        <FormularBereich istVersteckt={name === "token"}>
          <Form.Field
            {...bereich}
            control={Input}
            autoComplete="off"
            label={label}
            type={typ}
            id={name}
            autoFocus={name === "password"}
          />
        </FormularBereich>
      );
    };
  }

  function rendenAnfordern() {
    const hatFehler = !!email.trim() && !!emailError;

    return (
      <BerechtigungKarte className="anfordern">
        <Card.Content className="anfordern__intro" extra={true}>
          {erfolgNachricht ? (
            erfolgNachricht
          ) : (
            <span>
              Geben Sie Ihr E-mail Adresse ein und Sie erhalten einen Link, um
              das passwortzurücksetzen.
            </span>
          )}
        </Card.Content>

        <Card.Content>
          <Form
            onSubmit={async () => {
              setWirdGeladen(true);
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
                    Wir haben nach Ihr E-mail Adress {serverEmail} ein Link zum
                    passwort zuruck setzen geschickt. Klicken Sie auf dem Link.
                  </div>
                );
              } catch (fehler) {
                einstellenGqlFehler(fehler);
                setWirdGeladen(false);
              }
            }}
          >
            <Form.Field error={hatFehler}>
              {andererFehlerNachrichte && (
                <div className="email-error ">{andererFehlerNachrichte}</div>
              )}

              <label htmlFor="passwort-zuruck-setzen-anfordern">
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
              />
              {hatFehler && <div className="email-error ">{emailError}</div>}
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
    );
  }

  const {
    match: {
      params: { token }
    }
  } = merkmale;

  return (
    <Behälter>
      <Header />

      <BerechtigungHaupanwendung>
        {token === ZURUCK_SETZEN_PFAD_ANFORDERN ? (
          rendenAnfordern()
        ) : (
          <Formik
            initialValues={{
              email: "",
              password: "",
              passwordConfirmation: "",
              token: ""
            }}
            onSubmit={() => null}
            render={rendernAndern}
            validationSchema={ValidationSchema}
            validateOnChange={false}
          />
        )}
      </BerechtigungHaupanwendung>
    </Behälter>
  );
}

export default PasswortZurückSetzen;
