import React from "react";
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

import "./login.scss";
import { Props, ValidationSchema } from "./login";
import { LoginInput } from "../graphql/apollo-gql";
import { SIGN_UP_URL, ROOT_URL } from "../routing";
import PwdInput from "../PwdInput";

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
      <div className="app-container">
        <div className="app-main routes-login">
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
        </div>
      </div>
    );
  }

  private renderForm = (props: FormikProps<LoginInput>) => {
    const { history } = this.props;
    const { graphQlErrors, otherErrors, formErrors } = this.state;
    const { dirty, isSubmitting } = props;

    return (
      <Card>
        <Errors
          errors={{ graphQlErrors, otherErrors, formErrors }}
          handleErrorsDismissed={this.handleErrorsDismissed}
        />

        <Card.Content extra={true}>Login to your account</Card.Content>

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

        <Card.Content extra={true}>
          <Button
            className="to-sign-up-button"
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
    this.handleErrorsDismissed();

    const { login, updateLocalUser, history } = this.props;

    if (!login) {
      setSubmitting(false);
      this.setState({ otherErrors: "Unknown error" });
      return;
    }

    setSubmitting(true);

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

        history.push(ROOT_URL);
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
