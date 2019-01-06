import { graphql, compose } from "react-apollo";

import AuthRequired from "./auth-required-x";
import AUTH_USER_LOCAL_QUERY, {
  UserLocalGqlData,
  UserLocalGqlProps
} from "../State/auth.local.query";

const authUserLocalGraphQl = graphql<
  {},
  UserLocalGqlData,
  {},
  UserLocalGqlProps | undefined
>(AUTH_USER_LOCAL_QUERY, {
  props: ({ data }) => {
    return data;
  }
});

export default compose(authUserLocalGraphQl)(AuthRequired);
