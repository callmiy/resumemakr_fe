import { graphql, compose } from "react-apollo";

import Home from "./home-x";

import CREATE_RESUME_TITLE, {
  CreateResumeProps
} from "../graphql/create-resume.mutation";

import {
  CreateResume,
  CreateResumeVariables,
  ResumeTitles,
  ResumeTitlesVariables
} from "../graphql/apollo-gql";

import RESUME_TITLES_QUERY, {
  ResumeTitlesProps
} from "../graphql/resume-titles.query";

import { deleteResumeGql } from "../graphql/delete-resume.mutation";

const createResumeGql = graphql<
  {},
  CreateResume,
  CreateResumeVariables,
  CreateResumeProps | void
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
  createResumeGql,
  deleteResumeGql
)(Home);
