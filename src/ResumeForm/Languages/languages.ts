import * as Yup from "yup";

export interface Lang {
  description: string;
  ratingDescription?: string;
}

export const defaultVal: Lang = {
  description: "Spanish",
  ratingDescription: "C1"
};

export const emptyVal: Lang = {
  description: "",
  ratingDescription: ""
};

export const validationSchema = Yup.object<Lang>().shape({
  description: Yup.string()
    .required()
    .min(2),
  ratingDescription: Yup.string()
});
