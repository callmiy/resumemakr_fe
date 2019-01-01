import * as Yup from "yup";

export interface AdditionalSkill {
  description: string;
  ratingDescription?: string;
}

export const defaultValue: AdditionalSkill = {
  description: "Adobe Photoshop",
  ratingDescription: "Excellent"
};

export const emptyValue: AdditionalSkill = {
  description: "",
  ratingDescription: ""
};

export const validationSchema = Yup.object<AdditionalSkill>().shape({
  description: Yup.string()
    .required()
    .min(2),
  ratingDescription: Yup.string()
});
