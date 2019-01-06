import { graphql, compose, withApollo } from "react-apollo";

import Login from "./login-x";
import { userLocalMutationGql } from "../State/user.local.mutation";

import { LoginMutation, LoginMutationVariables } from "../graphql/apollo-gql";

import LOGIN_MUTATION, { LoginMutationProps } from "../graphql/login.mutation";

const loginGql = graphql<
  {},
  LoginMutation,
  LoginMutationVariables,
  LoginMutationProps
>(LOGIN_MUTATION, {
  props: props => {
    const mutate = props.mutate;

    return {
      login: mutate
    };
  }
});

export default compose(
  withApollo,
  userLocalMutationGql,
  loginGql
)(Login);
