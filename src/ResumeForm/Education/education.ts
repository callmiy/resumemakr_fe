import * as Yup from "yup";

export interface Edu {
  school: string;
  course: string;
}

export const emptyVal: Edu = {
  school: "",
  course: ""
};

export const defaultVal: Edu = {
  school: "The City College of New York, New York City, NY",
  course: "MS in Computer Science, Distinction"
};

export const validationSchema = Yup.object<Edu>().shape({
  school: Yup.string()
    .required()
    .min(5),
  course: Yup.string()
    .required()
    .min(5)
});
