import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";

import USER_LOCAL_QUERY, {
  UserLocalGqlProps,
  UserLocalGqlData
} from "../State/auth.local.query";

import { Header } from "./header-x";
import { OwnProps } from "./header";
import { userLocalMutationGql } from "../State/user.local.mutation";

const userLocalGql = graphql<
  OwnProps,
  UserLocalGqlData,
  {},
  UserLocalGqlProps | undefined
>(USER_LOCAL_QUERY, {
  props: ({ data }) => data
});

export default compose(
  withRouter,
  userLocalGql,
  userLocalMutationGql
)(Header);
