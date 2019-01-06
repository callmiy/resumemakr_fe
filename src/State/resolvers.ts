import { withClientState } from "apollo-link-state";
import { InMemoryCache } from "apollo-cache-inmemory";

import { UserFragment } from "../graphql/apollo-gql";
import { Variable as UserMutationVar } from "./user.local.mutation";
import USER_QUERY, { UserLocalGqlData } from "./auth.local.query";
// import { resetClientAndPersistor } from "../containers/AppContext/set-up";
import { getToken, clearToken, storeToken } from "./tokens";

type ClientStateFn<TVariables> = (
  fieldName: string,
  variables: TVariables,
  context: { cache: InMemoryCache }
) => void;

const setCurrentResumeTitle: ClientStateFn<{
  title: string;
}> = (_, { title }, { cache }) => {
  const currentResumeTitle = {
    __typename: "CurrentResumeTitle",
    title
  };

  cache.writeData({ data: { currentResumeTitle } });
  return currentResumeTitle;
};

const userMutation: ClientStateFn<UserMutationVar> = async (
  _,
  { user },
  { cache }
) => {
  if (user) {
    cache.writeData({ data: { user, staleToken: null, loggedOutUser: null } });
    storeToken(user.jwt);

    return user;
  }

  // MEANS WE HAVE LOGGED OUT. we store the current user as `loggedOutUser`
  // so we can pre-fill the sign in form with e.g. user email

  const { user: loggedOutUser } = {
    ...(cache.readQuery<UserLocalGqlData>({ query: USER_QUERY }) || {
      user: null
    })
  };

  const data = {
    user: null,
    staleToken: null,
    currentResumeTitle: null
  } as {
    loggedOutUser?: UserFragment | null;
  };

  if (loggedOutUser) {
    // await resetClientAndPersistor();
    data.loggedOutUser = loggedOutUser;
  }

  await cache.writeData({
    data
  });
  clearToken();

  return loggedOutUser;
};

export default (cache: InMemoryCache) => {
  return withClientState({
    cache,
    resolvers: {
      Mutation: {
        currentResumeTitle: setCurrentResumeTitle,
        user: userMutation
      }
    },
    defaults: {
      staleToken: getToken(),
      user: null,
      loggedOutUser: null,
      currentResumeTitle: null
    }
  });
};
