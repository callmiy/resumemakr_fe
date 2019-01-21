import React from "react";
import { Button, Card, Input, Message, Icon, Form } from "semantic-ui-react";
import "styled-components/macro";

import {
  Formik,
  FastField,
  FieldProps,
  FormikProps,
  FormikErrors
} from "formik";

import loIsEmpty from "lodash/isEmpty";
import { ApolloError } from "apollo-client";

import {
  Props,
  initialFormValues,
  ValidationSchema,
  FormValuesKey
} from "./sign-up";

import { RegistrationInput } from "../graphql/apollo-gql";
import { LOGIN_URL } from "../routing";
import Header from "../Header";
import { AppContainer, AppMain1 } from "../styles/mixins";
import refreshToHomeDefault from "../refresh-to-home";
import getConnDefault from "../State/get-conn-status";

const FORM_RENDER_PROPS = {
  name: ["Name", "text"],
  email: ["Email", "email"],
  password: ["Password", "password"],
  passwordConfirmation: ["Confirm Password", "password"],
  source: ["Source", "text"]
};

interface State {
  otherErrors?: string;
  formErrors?: FormikErrors<RegistrationInput>;
  graphQlErrors?: ApolloError;
}

export class SignUp extends React.Component<Props, State> {
  state: State = {};
  mainRef = React.createRef<HTMLDivElement>();

  render() {
    return (
      <AppContainer>
        <Header />

        <AppMain1
          ref={this.mainRef}
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <Formik
            initialValues={initialFormValues}
            onSubmit={() => null}
            render={this.renderForm}
            validationSchema={ValidationSchema}
            validateOnChange={false}
          />
        </AppMain1>
      </AppContainer>
    );
  }

  private onSubmit = ({
    values,
    setSubmitting,
    validateForm
  }: FormikProps<RegistrationInput>) => async () => {
    setSubmitting(true);
    this.handleErrorsDismissed();

    const {
      regUser,
      updateLocalUser,
      scrollToTop = this.defaultScrollToTop,
      getConn = getConnDefault,
      refreshToHome = refreshToHomeDefault,
      client
    } = this.props;

    if (!regUser) {
      setSubmitting(false);
      this.setState({ otherErrors: "Unknown error" });
      scrollToTop();
      return;
    }

    const errors = await validateForm(values);

    if (!loIsEmpty(errors)) {
      setSubmitting(false);
      this.setState({ formErrors: errors });
      scrollToTop();
      return;
    }

    if (!(await getConn(client))) {
      setSubmitting(false);
      this.setState({ otherErrors: "You are not connected" });
      return;
    }

    try {
      const result = await regUser({
        variables: { input: values }
      });

      if (result && result.data) {
        const { registration } = result.data;

        if (!registration) {
          return;
        }

        const { user } = registration;

        if (updateLocalUser) {
          await updateLocalUser({ variables: { user } });
        }

        refreshToHome();
      }
    } catch (error) {
      setSubmitting(false);
      this.setState({ graphQlErrors: error });
      scrollToTop();
    }
  };

  private renderForm = (props: FormikProps<RegistrationInput>) => {
    const { dirty, isSubmitting } = props;
    const { history } = this.props;

    return (
      <Card
        css={`
          overflow-y: auto;
          height: 85%;
          min-width: 310px;
          width: 95% !important;
          max-width: 400px !important;
          min-height: 350px !important;
        `}
      >
        {this.renderFormErrors()}

        <Card.Content
          css={`
            flex-shrink: 0;
          `}
          extra={true}
        >
          Sign up to create your resume
        </Card.Content>

        <Card.Content>
          <Form onSubmit={this.onSubmit(props)}>
            {Object.entries(FORM_RENDER_PROPS).map(([name, [label, type]]) => {
              return (
                <FastField
                  key={name}
                  name={name}
                  render={this.renderInput(label, type)}
                />
              );
            })}

            <Button
              id="sign-up-submit"
              name="sign-up-submit"
              color="green"
              inverted={true}
              disabled={!dirty || isSubmitting}
              loading={isSubmitting}
              type="submit"
              fluid={true}
            >
              <Icon name="checkmark" /> Submit
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
            onClick={() => history.replace(LOGIN_URL)}
            disabled={isSubmitting}
          >
            Already have an account? Login
          </Button>
        </Card.Content>
      </Card>
    );
  };

  private defaultScrollToTop = () => {
    if (this.mainRef && this.mainRef.current) {
      this.mainRef.current.scrollTop = 0;
    }
  };

  private renderFormErrors = () => {
    const { formErrors, graphQlErrors, otherErrors } = this.state;

    let content = null;

    if (otherErrors) {
      content = otherErrors;
    }

    if (formErrors) {
      content = (
        <>
          <span>Errors in fields:</span>
          {Object.entries(formErrors).map(([k, err]) => {
            const label = FORM_RENDER_PROPS[k][0];
            return (
              <div key={label}>
                <div className="error-label">{label}</div>
                <div className="error-text">{err}</div>
              </div>
            );
          })}
        </>
      );
    }

    if (graphQlErrors) {
      content = graphQlErrors.message;
    }

    if (content) {
      return (
        <Card.Content extra={true} data-testid="sign-up-form-error">
          <Message error={true} onDismiss={this.handleErrorsDismissed}>
            <Message.Content>{content}</Message.Content>
          </Message>
        </Card.Content>
      );
    }

    return null;
  };

  private handleErrorsDismissed = () => {
    this.setState({
      formErrors: undefined,
      graphQlErrors: undefined,
      otherErrors: undefined
    });
  };

  private renderInput = (label: string, type: string) => (
    formProps: FieldProps<RegistrationInput>
  ) => {
    const { field } = formProps;
    const name = field.name as FormValuesKey;
    const isSourceField = name === "source";

    return (
      <Form.Field
        {...field}
        className={`form-field ${isSourceField ? "disabled" : ""}`}
        type={type}
        control={Input}
        autoComplete="off"
        label={label}
        id={name}
        autoFocus={name === "name"}
        readOnly={isSourceField}
      />
    );
  };
}

export default SignUp;
