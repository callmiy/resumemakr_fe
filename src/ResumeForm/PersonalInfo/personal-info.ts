import * as Yup from "yup";

export interface PersonalInfoVal {
  first_name: string;
  last_name: string;
  profession: string;
  phone: string;
  photo?: string;
  address: string;
  email: string;
  date_of_birth?: string;
}

export const defaultVal: PersonalInfoVal = {
  first_name: "Adekanmi",
  last_name: "Ademiiju",
  profession: "Full Stack Developer",
  phone: "+4915213839916",
  address: `30 Ortenberger Straße
77654 Offenburg
Germany`,
  email: "maneptha@gmail.com",
  date_of_birth: "",
  photo: ""
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
  date_of_birth: Yup.string().min(2),
  photo: Yup.string()
});

export const emptyVals: PersonalInfoVal = {
  first_name: "",
  last_name: "",
  profession: "",
  phone: "",
  photo: "",
  address: "",
  email: "",
  date_of_birth: ""
};
