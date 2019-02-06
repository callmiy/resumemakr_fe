import React from "react";
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
  Zustand,
  FORMULAR_RENDERN_MARKMALE,
  ValidationSchema,
  emailValidator
} from "./passwort-zurück-setzen";
import { LOGIN_URL, ZURUCK_SETZEN_PFAD_ANFORDERN } from "../routing";
import Header from "../Header";
import { BerechtigungHaupanwendung, BerechtigungKarte } from "../styles/mixins";
import { Behälter, FormularBereich } from "./passwort-zurück-setzen.styles";
import { PasswortZuruckSetzenInput } from "../graphql/apollo-gql";

export class PasswortZurückSetzen extends React.Component<Merkmale, Zustand> {
  state: Zustand = {
    email: ""
  };

  render() {
    const {
      match: {
        params: { token }
      }
    } = this.props;

    return (
      <Behälter>
        <Header />

        <BerechtigungHaupanwendung>
          {token === ZURUCK_SETZEN_PFAD_ANFORDERN ? (
            this.rendenErstellen()
          ) : (
            <Formik
              initialValues={{
                email: "",
                password: "",
                passwordConfirmation: "",
                token: ""
              }}
              onSubmit={() => null}
              render={this.renderForm}
              validationSchema={ValidationSchema}
              validateOnChange={false}
            />
          )}
        </BerechtigungHaupanwendung>
      </Behälter>
    );
  }

  private renderForm = (merkMale: FormikProps<PasswortZuruckSetzenInput>) => {
    const { dirty: schmutzig, isSubmitting: istEinreichen } = merkMale;
    const { history: verlauf } = this.props;

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
                    render={this.rendernEingabe(label, type)}
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
  };

  private rendernEingabe = (label: string, typ: string) => (
    formularMarkmale: FieldProps<PasswortZuruckSetzenInput>
  ) => {
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

  private rendenErstellen = () => {
    const { email, emailError, wirdGeladen } = this.state;
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
              this.setState({ wirdGeladen: true });
              const data = email.trim();

              try {
                emailValidator.validateSync(data);
              } catch (error) {
                this.setState({
                  emailError: error.message,
                  wirdGeladen: false
                });
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
                    this.setState({ email: value });
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
  };
}

export default PasswortZurückSetzen;
