import { compose, graphql } from "react-apollo";
import { withRouter } from "react-router-dom";

import { GetResume, GetResumeVariables } from "../graphql/apollo-gql";

import { Preview } from "./preview-x";
import { OwnProps, Mode } from "./preview";
import { getResumeQuery, GetResumeProps } from "../graphql/get-resume.query";

const getResumeGql = graphql<
  OwnProps,
  GetResume,
  GetResumeVariables,
  GetResumeProps | void
>(getResumeQuery, {
  props: ({ data }) => data,

  skip: ({ mode }) => mode === Mode.preview,

  options: ({ match }) => {
    return {
      variables: {
        input: {
          title: decodeURIComponent(match.params.title)
        }
      },

      fetchPolicy: "cache-and-network"
    };
  }
});

export default compose(
  withRouter,
  getResumeGql
)(Preview);
