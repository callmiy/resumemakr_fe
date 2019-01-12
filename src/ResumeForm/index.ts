import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import { withFormik } from "formik";

import {
  GetResume,
  GetResumeVariables,
  GetResume_getResume
} from "../graphql/apollo-gql";

import ResumeForm from "./resume-form-x";
import { updateResumeGql } from "../graphql/update-resume.mutation";
import { OwnProps, formikConfig } from "./resume-form";
import { getResumeQuery, GetResumeProps } from "../graphql/get-resume.query";
import { getInitialValues } from "./resume-form";

const getResumeGql = graphql<
  OwnProps,
  GetResume,
  GetResumeVariables,
  GetResumeProps | void
>(getResumeQuery, {
  props: ({ data }) => {
    if (!data) {
      return data;
    }

    const { loading, error, getResume } = data;

    if (loading || error) {
      return data;
    }

    return {
      ...data,
      getResume: getInitialValues(getResume) as GetResume_getResume
    };
  },

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
  getResumeGql,
  withFormik(formikConfig),
  updateResumeGql
)(ResumeForm);
