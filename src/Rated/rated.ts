import * as Yup from "yup";

import { RatedInput } from "../graphql/apollo-gql";

export const emptyVal: RatedInput = {
  description: "",
  level: "",
  index: 1
};

export const validationSchema = Yup.object<RatedInput>().shape({
  description: Yup.string(),
  level: Yup.string(),
  index: Yup.number()
    .required()
    .min(1)
});
