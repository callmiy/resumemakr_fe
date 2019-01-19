import { graphql } from "react-apollo";

import USER_LOCAL_QUERY, {
  UserLocalGqlProps,
  UserLocalGqlData
} from "../State/auth.local.query";

import { Header } from "./header-x";
import { OwnProps } from "./header";

const userLocalGql = graphql<
  OwnProps,
  UserLocalGqlData,
  {},
  UserLocalGqlProps | undefined
>(USER_LOCAL_QUERY, {
  props: ({ data }) => data
});

export default userLocalGql(Header);
