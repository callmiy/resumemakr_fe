import * as Yup from "yup";

import { EducationInput } from "../graphql/apollo-gql";


export const emptyVal: EducationInput = {
  school: "",
  course: "",
  fromDate: "",
  toDate: "",
  achievements: []
};

export const defaultVal: EducationInput = {
  school: "The City College of New York, New York City, NY",
  course: "MS in Computer Science, Distinction",
  fromDate: "02/2013",
  toDate: "03/2015",
  achievements: ["Graduated summer cum laude", "President of student union"]
};

export const validationSchema = Yup.object<EducationInput>().shape({
  school: Yup.string()
    .required()
    .min(5),
  course: Yup.string()
    .required()
    .min(5),
  fromDate: Yup.string(),
  toDate: Yup.string(),
  achievements: Yup.array<string>()
});
