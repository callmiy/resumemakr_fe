import * as Yup from "yup";
import { RouteComponentProps } from "react-router-dom";
import { FormikErrors } from "formik";
import { ApolloError } from "apollo-client";

import { LoginInput as FormValues } from "../graphql/apollo-gql";
import { LoginMutationProps } from "../graphql/login.mutation";
import { UserLocalMutationProps } from "../State/user.local.mutation";
import { UserLocalGqlProps } from "../State/auth.local.query";

export interface OwnProps extends RouteComponentProps<{}> {}

export type Props = OwnProps &
  LoginMutationProps &
  UserLocalMutationProps &
  UserLocalGqlProps;

export const ValidationSchema = Yup.object<FormValues>().shape({
  email: Yup.string()
    .email("Must be valid email address")
    .required(),
  password: Yup.string()
    .required()
    .min(4, "Too short")
});

export const RouterThings = {
  documentTitle: "Log in"
};

export enum Action_Types {
  SET_OTHER_ERRORS = "@login/SET_OTHER_ERRORS",
  SET_FORM_ERROR = "@login/SET_FORM_ERROR",
  SET_GRAPHQL_ERROR = "@login/SET_GRAPHQL_ERROR"
}

export interface State {
  readonly otherErrors?: string;
  readonly formErrors?: FormikErrors<FormValues>;
  readonly graphQlErrors?: ApolloError;
  readonly pwdType?: "password" | "text";
}
