import React, { useState, useEffect } from "react";
import { Button, Card, Input, Message, Icon, Form } from "semantic-ui-react";
import { ApolloError } from "apollo-client";
import {
  Formik,
  FastField,
  FieldProps,
  FormikProps,
  Field,
  FormikErrors
} from "formik";

import { Props, ValidationSchema } from "./login";
import { LoginInput } from "../graphql/apollo-gql";
import { createSignUpRoute } from "../routing";
import PwdInput from "../PwdInput";
import { BerechtigungKarte } from "../styles/mixins";
import refreshToHomeDefault from "../refresh-to-home";
import getConnDefault from "../State/get-conn-status";

const Errors = React.memo(ErrorsComp, ErrorsCompEqual);

export function Login(merkmale: Props) {
  const {
    user,
    updateLocalUser,
    loggedOutUser,
    history,
    client,
    getConn = getConnDefault,
    refreshToHome = refreshToHomeDefault,
    login,
    flipClassName
  } = merkmale;

  const [graphQlErrors, setGraphQlErrors] = useState<ApolloError | undefined>(
    undefined
  );

  const [otherErrors, setOtherErrors] = useState<undefined | string>(undefined);

  const [formErrors, setFormErrors] = useState<
    undefined | FormikErrors<LoginInput>
  >(undefined);

  useEffect(function logoutUser() {
    if (!user) {
      return;
    }

    if (updateLocalUser) {
      updateLocalUser({
        variables: {
          user: null
        }
      });
    }
  }, []);

  function onSubmit({
    values,
    setSubmitting,
    validateForm
  }: FormikProps<LoginInput>) {
    return async function() {
      setSubmitting(true);
      handleErrorsDismissed();

      if (!login) {
        setSubmitting(false);
        setOtherErrors("Unknown error");
        return;
      }

      const errors = await validateForm(values);

      if (errors.email || errors.password) {
        setSubmitting(false);
        setFormErrors(errors);
        return;
      }

      if (!(await getConn(client))) {
        setSubmitting(false);
        setOtherErrors("You are not connected");
        return;
      }

      try {
        const result = await login({
          variables: {
            input: values
          }
        });

        const resultUser =
          result && result.data && result.data.login && result.data.login.user;

        if (!resultUser) {
          setSubmitting(false);
          setOtherErrors("There is a problem logging you in.");
          return;
        }

        if (updateLocalUser) {
          await updateLocalUser({
            variables: { user: resultUser }
          });
        }

        refreshToHome();
      } catch (error) {
        setSubmitting(false);
        setGraphQlErrors(error);
      }
    };
  }

  function handleErrorsDismissed() {
    setOtherErrors(undefined);
    setFormErrors(undefined);
    setGraphQlErrors(undefined);
  }

  function renderForm(props: FormikProps<LoginInput>) {
    const { dirty, isSubmitting } = props;

    return (
      <BerechtigungKarte className={flipClassName}>
        <Errors
          errors={{ graphQlErrors, otherErrors, formErrors }}
          handleErrorsDismissed={handleErrorsDismissed}
        />

        <Card.Content style={{ flexShrink: "0" }} extra={true}>
          ins konto einloggen
        </Card.Content>

        <Card.Content>
          <Form onSubmit={onSubmit(props)}>
            <FastField name="email" component={EmailInput} />

            <Field name="password" component={PwdInput} />

            <Button
              id="login-submit"
              name="login-submit"
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

        <Card.Content style={{ flexShrink: "0" }} extra={true}>
          <Button
            type="button"
            fluid={true}
            onClick={() => history.replace(createSignUpRoute())}
            disabled={isSubmitting}
            name="to-sign-up"
          >
            Don't have an account? Sign Up
          </Button>
        </Card.Content>
      </BerechtigungKarte>
    );
  }

  return (
    <Formik
      initialValues={{
        email:
          (user && user.email) || (loggedOutUser && loggedOutUser.email) || "",
        password: ""
      }}
      onSubmit={() => null}
      render={renderForm}
      validationSchema={ValidationSchema}
      validateOnChange={false}
    />
  );
}

export default Login;

function EmailInput(props: FieldProps<LoginInput>) {
  const { field } = props;

  return (
    <Form.Field>
      <label htmlFor="email">Email</label>
      <Input
        {...field}
        type="email"
        autoComplete="off"
        autoFocus={true}
        id="email"
      />
    </Form.Field>
  );
}

interface ErrorsProps {
  errors: {
    otherErrors?: string;
    formErrors?: FormikErrors<LoginInput>;
    graphQlErrors?: ApolloError;
  };
  handleErrorsDismissed: () => void;
}

function ErrorsCompEqual(
  { errors: p }: ErrorsProps,
  { errors: n }: ErrorsProps
) {
  for (const [k, v] of Object.entries(p)) {
    if (v !== n[k]) {
      return false;
    }
  }

  return true;
}

function ErrorsComp(props: ErrorsProps) {
  const {
    errors: { otherErrors, formErrors, graphQlErrors },
    handleErrorsDismissed
  } = props;

  function messageContent() {
    if (otherErrors) {
      return otherErrors;
    }

    if (formErrors) {
      const { email, password } = formErrors;

      return (
        <>
          <span>Errors in fields: </span>

          {email && (
            <div>
              <span>Email: </span>
              <span>{email}</span>
            </div>
          )}

          {password && (
            <div>
              <span>Password: </span>
              <span>{password}</span>
            </div>
          )}
        </>
      );
    }

    if (graphQlErrors) {
      return graphQlErrors.graphQLErrors[0].message;
    }

    return null;
  }

  const content = messageContent();

  if (!content) {
    return null;
  }

  return (
    <Card.Content data-testid="login-form-error" extra={true}>
      <Message error={true} onDismiss={handleErrorsDismissed}>
        <Message.Content>{content}</Message.Content>
      </Message>
    </Card.Content>
  );
}
