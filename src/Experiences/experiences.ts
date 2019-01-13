import * as Yup from "yup";

import { CreateExperienceInput } from "../graphql/apollo-gql";

export const emptyVals: CreateExperienceInput = {
  position: "",
  companyName: "",
  fromDate: "",
  toDate: "",
  achievements: []
};

export const validationSchema = Yup.object<CreateExperienceInput>().shape({
  position: Yup.string(),
  companyName: Yup.string(),
  fromDate: Yup.string(),
  toDate: Yup.string(),
  achievements: Yup.array<string>()
});

export const defaultVal: CreateExperienceInput = {
  position: "IT Manager",
  companyName: "Apple, New York City, NY",
  fromDate: "2015-03-31",
  toDate: "2016-03-05",
  achievements: [
    "Supervised the IT team in creating mobile apps providing the best user experience for Apple's customers all over the world.",

    "Developed, reviewed, and tested innovative and visionary new applications using emerging technologies.",

    "Guided talent that provides technical support and training while working in partnership with the business team."
  ]
};
