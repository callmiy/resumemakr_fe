import { RouteComponentProps } from "react-router-dom";
import * as Yup from "yup";
import { ApolloError } from "apollo-client";
import { FormikErrors } from "formik";

import { CreateResumeProps } from "../graphql/create-resume.mutation";
import { ResumeTitlesProps } from "../graphql/resume-titles.query";
import { DeleteResumeProps } from "../graphql/delete-resume.mutation";
import { CloneResumeProps } from "../graphql/clone-resume.mutation";
import { CreateResumeInput } from "../graphql/apollo-gql";

export interface OwnProps extends RouteComponentProps<{}> {}

export interface Props
  extends CreateResumeProps,
    OwnProps,
    ResumeTitlesProps,
    DeleteResumeProps,
    CloneResumeProps {}

export interface State {
  openModal?: boolean;
  graphQlError?: ApolloError;
  deleteError?: {
    id: string;
    errors: string[];
  };
  deletedResume?: string;
  deletingResume?: string;
  confirmDeleteId?: string;
  formErrors?: FormikErrors<CreateResumeInput>;
}

export const validationSchema = Yup.object<CreateResumeInput>().shape({
  title: Yup.string()
    .required()
    .min(2),
  description: Yup.string()
});

export enum Action {
  createResume = "CreateResume",
  cloneResume = "CloneResume"
}

export const emptyVal = { title: "", description: "" };
