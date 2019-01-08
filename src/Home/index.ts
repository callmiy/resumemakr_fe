import { graphql, compose } from "react-apollo";

import Home from "./home-x";
import { OwnProps } from "./home";

import { currentResumeTitleLocalMutationGql } from "../State/current-resume-title.local.mutation";

import CREATE_RESUME_TITLE, {
  CreateResumeTitleProps
} from "../graphql/create-resume-title.mutation";

import {
  CreateResumeTitle,
  CreateResumeTitleVariables,
  ResumeTitles,
  ResumeTitlesVariables
} from "../graphql/apollo-gql";

import RESUME_TITLES_QUERY, {
  ResumeTitlesProps
} from "../graphql/resume-titles.query";

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

const resumeTitlesGql = graphql<
  {},
  ResumeTitles,
  ResumeTitlesVariables,
  ResumeTitlesProps | undefined
>(RESUME_TITLES_QUERY, {
  props: ({ data }) => data,

  options: () => ({
    variables: {
      howMany: 10
    },

    fetchPolicy: "cache-and-network"
  })
});

export default compose(
  resumeTitlesGql,
  currentResumeTitleLocalMutationGql<OwnProps>(),
  createResumeTitleGql
)(Home);
