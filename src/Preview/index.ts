import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";

import { Preview } from "./preview-x";
import { OwnProps } from "./preview";
import { getResumeQuery, GetResumeProps } from "../graphql/get-resume.query";
import { GetResume, GetResumeVariables } from "../graphql/apollo-gql";

const getResumeGql = graphql<
  OwnProps,
  GetResume,
  GetResumeVariables,
  GetResumeProps | undefined
>(getResumeQuery, {
  props: ({ data }) => data,

  options: ({ match }) => {
    return {
      variables: {
        input: {
          title: match.params.title
        }
      }
    };
  }
});

export default compose(
  withRouter,
  getResumeGql
)(Preview);
