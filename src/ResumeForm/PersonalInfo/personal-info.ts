import * as Yup from "yup";

export interface PersonalInfoVal {
  first_name: string;
  last_name: string;
  profession: string;
  phone: string;
  photo?: File | null;
  address: string;
  email: string;
  date_of_birth: string;
}

export const defaultVal: PersonalInfoVal = {
  first_name: "Christian",
  last_name: "Hybrid",
  profession: "IT Manager",
  phone: "202-555-0177",
  photo: null,
  address: `970 Drummond Street
Newark, NJ 07102
USA`,
  email: "christian.w.hybrid@gmail.com",
  date_of_birth: ""
};

export const validationSchema = Yup.object<PersonalInfoVal>().shape({
  phone: Yup.string()
    .required()
    .min(2),
  first_name: Yup.string()
    .required()
    .min(2),
  last_name: Yup.string()
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
  date_of_birth: Yup.string()
    .required()
    .min(2)
});

export const emptyVals = {
  first_name: "",
  last_name: "",
  profession: "",
  phone: "",
  photo: null,
  address: "",
  email: "",
  date_of_birth: ""
};
