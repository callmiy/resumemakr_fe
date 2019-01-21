import React from "react";
import { Button, Card, Input, Message, Icon, Form } from "semantic-ui-react";
import { ApolloError } from "apollo-client";
import "styled-components/macro";

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
import { SIGN_UP_URL } from "../routing";
import PwdInput from "../PwdInput";
import Header from "../Header";
import { AppContainer, AppMain1 } from "../styles/mixins";
import refreshToHomeDefault from "../refresh-to-home";
import getConnDefault from "../State/get-conn-status";

const Errors = React.memo(ErrorsComp, ErrorsCompEqual);

interface State {
  otherErrors?: string;
  formErrors?: FormikErrors<LoginInput>;
  graphQlErrors?: ApolloError;
  pwdType?: "password" | "text";
}

export class Login extends React.Component<Props, State> {
  state: State = {};

  componentDidMount() {
    this.logoutUser();
  }

  render() {
    const { loggedOutUser, user } = this.props;

    return (
      <AppContainer>
        <Header />

        <AppMain1
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <Formik
            initialValues={{
              email:
                (user && user.email) ||
                (loggedOutUser && loggedOutUser.email) ||
                "",
              password: ""
            }}
            onSubmit={() => null}
            render={this.renderForm}
            validationSchema={ValidationSchema}
            validateOnChange={false}
          />
        </AppMain1>
      </AppContainer>
    );
  }

  private renderForm = (props: FormikProps<LoginInput>) => {
    const { history } = this.props;
    const { graphQlErrors, otherErrors, formErrors } = this.state;
    const { dirty, isSubmitting } = props;

    return (
      <Card
        css={`
          overflow-y: auto;
          height: 45%;
          min-width: 310px;
          width: 95% !important;
          max-width: 400px !important;
          min-height: 350px !important;
        `}
      >
        <Errors
          errors={{ graphQlErrors, otherErrors, formErrors }}
          handleErrorsDismissed={this.handleErrorsDismissed}
        />

        <Card.Content
          css={`
            flex-shrink: 0;
          `}
          extra={true}
        >
          Login to your account
        </Card.Content>

        <Card.Content>
          <Form onSubmit={this.onSubmit(props)}>
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

        <Card.Content
          css={`
            flex-shrink: 0;
          `}
          extra={true}
        >
          <Button
            type="button"
            fluid={true}
            onClick={() => history.replace(SIGN_UP_URL)}
            disabled={isSubmitting}
            name="to-sign-up"
          >
            Don't have an account? Sign Up
          </Button>
        </Card.Content>
      </Card>
    );
  };

  private handleErrorsDismissed = () => {
    this.setState({
      formErrors: undefined,
      graphQlErrors: undefined,
      otherErrors: undefined
    });
  };

  private onSubmit = ({
    values,
    setSubmitting,
    validateForm
  }: FormikProps<LoginInput>) => async () => {
    setSubmitting(true);
    this.handleErrorsDismissed();

    const {
      login,
      updateLocalUser,
      client,
      getConn = getConnDefault,
      refreshToHome = refreshToHomeDefault
    } = this.props;

    if (!login) {
      setSubmitting(false);
      this.setState({ otherErrors: "Unknown error" });
      return;
    }

    if (!(await getConn(client))) {
      setSubmitting(false);
      this.setState({ otherErrors: "You are not connected" });
      return;
    }

    const errors = await validateForm(values);

    if (errors.email || errors.password) {
      setSubmitting(false);
      this.setState({ formErrors: errors });
      return;
    }

    try {
      const result = await login({
        variables: {
          input: values
        }
      });

      if (result && result.data) {
        const loggedInUser = result.data.login;

        if (!loggedInUser) {
          return;
        }

        const { user } = loggedInUser;

        if (updateLocalUser) {
          await updateLocalUser({
            variables: { user }
          });
        }

        refreshToHome();
      }
    } catch (error) {
      setSubmitting(false);
      this.setState({ graphQlErrors: error });
    }
  };

  private logoutUser = () => {
    const { user, updateLocalUser } = this.props;

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
  };
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
  errors: Exclude<State, "pwdType">;
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
      return graphQlErrors.message;
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
