import { graphql, compose } from "react-apollo";

import Home from "./home-x";
import { OwnProps } from "./home";
import { currentResumeTitleLocalMutationGql } from "../State/current-resume-title.local.mutation";
import CREATE_RESUME_TITLE, {
  CreateResumeTitleProps
} from "../graphql/create-resume-title.mutation";
import {
  CreateResumeTitle,
  CreateResumeTitleVariables
} from "../graphql/apollo-gql";

const createResumeTitleGql = graphql<
  {},
  CreateResumeTitle,
  CreateResumeTitleVariables,
  CreateResumeTitleProps | void
>(CREATE_RESUME_TITLE, {
  props: ({ mutate }) => {
    if (!mutate) {
      return undefined;
    }

    return {
      createResumeTitle: mutate
    };
  }
});

export default compose(
  currentResumeTitleLocalMutationGql<OwnProps>(),
  createResumeTitleGql
)(Home);
