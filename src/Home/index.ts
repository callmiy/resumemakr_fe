import { graphql, compose } from "react-apollo";

import Home from "./home-x";

import CREATE_RESUME_TITLE, {
  CreateResumeProps
} from "../graphql/create-resume.mutation";

import CLONE_RESUME, {
  CloneResumeProps
} from "../graphql/clone-resume.mutation";

import {
  CreateResume,
  CreateResumeVariables,
  ResumeTitles,
  ResumeTitlesVariables,
  CloneResume,
  CloneResumeVariables
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
      createResume: mutate
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

const cloneResumeGql = graphql<
  {},
  CloneResume,
  CloneResumeVariables,
  CloneResumeProps
>(CLONE_RESUME, {
  props: ({ mutate }) => {
    return {
      cloneResume: mutate
    };
  }
});

export default compose(
  resumeTitlesGql,
  createResumeGql,
  deleteResumeGql,
  cloneResumeGql
)(Home);
