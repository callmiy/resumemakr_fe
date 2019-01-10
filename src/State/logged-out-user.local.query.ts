import gql from "graphql-tag";
import { DataValue, graphql } from "react-apollo";

import { userFragment } from "../graphql/user.fragment";
import { UserFragment } from "../graphql/apollo-gql";

interface LoggedOutUserData {
  loggedOutUser?: UserFragment;
}

export type LoggedOutUserProps = DataValue<LoggedOutUserData>;

export const loggedOutUserGql = graphql<
  {},
  LoggedOutUserData,
  {},
  LoggedOutUserProps | void
>(
  gql`
    query LoggedOutUser {
      loggedOutUser @client {
        ...UserFragment
      }
    }

    ${userFragment}
  `,
  {
    props: ({ data }) => data
  }
);

export default loggedOutUserGql;
