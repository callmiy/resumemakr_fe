import * as Yup from "yup";

export interface EducationVal {
  school: string;
  course: string;
}

export const emptyVal: EducationVal = {
  school: "",
  course: ""
};

export const defaultVal: EducationVal = {
  school: "The City College of New York, New York City, NY",
  course: "MS in Computer Science, Distinction"
};

export const validationSchema = Yup.object<EducationVal>().shape({
  school: Yup.string()
    .required()
    .min(5),
  course: Yup.string()
    .required()
    .min(5)
});
