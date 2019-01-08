import { graphql, compose } from "react-apollo";

import Login from "./login-x";
import { userLocalMutationGql } from "../State/user.local.mutation";
import { LoginMutation, LoginMutationVariables } from "../graphql/apollo-gql";
import LOGIN_MUTATION, { LoginMutationProps } from "../graphql/login.mutation";
import USER_LOCAL_QUERY, {
  UserLocalGqlProps,
  UserLocalGqlData
} from "../State/auth.local.query";

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

const userLocalGql = graphql<
  {},
  UserLocalGqlData,
  {},
  UserLocalGqlProps | void
>(USER_LOCAL_QUERY, {
  props: ({ data }) => data
});

export default compose(
  userLocalGql,
  userLocalMutationGql,
  loginGql
)(Login);
