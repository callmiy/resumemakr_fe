import * as Yup from "yup";

import { RatedInput } from "../graphql/apollo-gql";

export const emptyVal: RatedInput = {
  description: "",
  level: ""
};

export const validationSchema = Yup.object<RatedInput>().shape({
  description: Yup.string(),
  level: Yup.string()
});
