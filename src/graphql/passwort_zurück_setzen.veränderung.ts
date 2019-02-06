import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import userFragment from "./user.fragment";
import {
  PasswortZuruckSetzen,
  PasswortZuruckSetzenVariables
} from "./apollo-gql";

export const PASSWORT_ZURÜCK_SETZEN = gql`
  mutation PasswortZuruckSetzen($input: PasswortZuruckSetzenInput!) {
    passwortZuruckSetzen(input: $input) {
      user {
        ...UserFragment
      }
    }
  }
  ${userFragment}
`;

export default PASSWORT_ZURÜCK_SETZEN;

export interface PasswortZuruckSetzenMerkmale {
  passwortZuruckSetzen?: MutationFn<
    PasswortZuruckSetzen,
    PasswortZuruckSetzenVariables
  >;
}
