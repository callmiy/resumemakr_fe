import * as Yup from "yup";

import { PersonalInfoInput } from "../graphql/apollo-gql";

export const defaultVal: PersonalInfoInput = {
  firstName: "Adekanmi",
  lastName: "Ademiiju",
  profession: "Full Stack Developer",
  phone: "+4915213839916",
  address: `30 Ortenberger Straße
77654 Offenburg
Germany`,
  email: "maneptha@gmail.com",
  dateOfBirth: "",
  photo: ""
};

export const validationSchema = Yup.object<PersonalInfoInput>().shape({
  phone: Yup.string()
    .required()
    .min(2),
  firstName: Yup.string()
    .required()
    .min(2),
  lastName: Yup.string()
    .required()
    .min(2),
  profession: Yup.string()
    .required()
    .min(2),
  address: Yup.string()
    .required()
    .min(2),
  email: Yup.string()
    .email()
    .required()
    .min(2),
  dateOfBirth: Yup.string().min(2),
  photo: Yup.string()
});

export const emptyVals: PersonalInfoInput = {
  firstName: "",
  lastName: "",
  profession: "",
  phone: "",
  photo: "",
  address: "",
  email: "",
  dateOfBirth: ""
};
