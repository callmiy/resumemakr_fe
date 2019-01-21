import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";

import { Preview } from "./preview-x";
import { OwnProps } from "./preview";
import {
  resumeDownloadQuery,
  ResumeDownloadProps
} from "../graphql/get-resume.query";
import { ResumeDownload, ResumeDownloadVariables } from "../graphql/apollo-gql";

const getResumeGql = graphql<
  OwnProps,
  ResumeDownload,
  ResumeDownloadVariables,
  ResumeDownloadProps | undefined
>(resumeDownloadQuery, {
  props: ({ data }) => data,

  options: ({ match }) => {
    return {
      variables: {
        input: {
          title: match.params.title
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
