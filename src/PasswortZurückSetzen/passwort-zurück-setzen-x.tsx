import React, { useState } from "react";
import "styled-components/macro";
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

export function PasswortZurückSetzen(merkmale: Merkmale) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [wirdGeladen, setWirdGeladen] = useState<boolean>(false);

  function renderForm(
    formularMerkmale: FormikProps<PasswortZuruckSetzenInput>
  ) {
    const { dirty: schmutzig, isSubmitting: istEinreichen } = formularMerkmale;
    const { history: verlauf } = merkmale;

    return (
      <BerechtigungKarte>
        <Card.Content
          css={`
            flex-shrink: 0;
          `}
          extra={true}
        >
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

        <Card.Content
          css={`
            flex-shrink: 0;
          `}
          extra={true}
        >
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
    const hasError = !!email.trim() && !!emailError;

    return (
      <BerechtigungKarte
        css={`
          height: initial;
          min-height: 0 !important;
        `}
      >
        <Card.Content
          extra={true}
          css={`
            color: #000 !important;
            font-weight: bolder;
          `}
        >
          Geben Sie Ihr E-mail Adresse ein und Sie erhalten einen Link, um das
          passwortzurücksetzen.
        </Card.Content>

        <Card.Content>
          <Form
            onSubmit={() => {
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
            }}
          >
            <Form.Field error={hasError}>
              <Input
                name="passwort-zuruck-setzen-erstellen"
                id="passwort-zuruck-erstellen"
                autoComplete="off"
                onChange={(
                  evt: React.ChangeEvent<HTMLInputElement>,
                  data: InputOnChangeData
                ) => {
                  const { value } = data;
                  if (value.trim()) {
                    setEmail(value);
                  }
                }}
              />

              {hasError && (
                <div
                  css={`
                    margin-top: 5px;
                    color: #9f3a38;
                  `}
                >
                  {emailError}
                </div>
              )}
            </Form.Field>

            <Button
              css={`
                margin-top: 50px !important;
              `}
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
            render={renderForm}
            validationSchema={ValidationSchema}
            validateOnChange={false}
          />
        )}
      </BerechtigungHaupanwendung>
    </Behälter>
  );
}

export default PasswortZurückSetzen;
