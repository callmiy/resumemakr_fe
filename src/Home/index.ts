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
  ResumeTitles
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
  {},
  ResumeTitlesProps | undefined
>(RESUME_TITLES_QUERY, {
  props: ({ data }) => data
});

export default compose(
  resumeTitlesGql,
  currentResumeTitleLocalMutationGql<OwnProps>(),
  createResumeTitleGql
)(Home);
