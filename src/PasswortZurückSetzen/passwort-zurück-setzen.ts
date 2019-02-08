import { RouteComponentProps } from "react-router-dom";
import * as Yup from "yup";
import { WithFormikConfig, FormikProps } from "formik";

import { PasswortZuruckSetzenVeranderungMerkmale } from "../graphql/passwort_zurück_setzen.veränderung";
import { AktualisierenAbfrageMerkmale } from "../graphql/aktualisieren.abfrage";
import { VeranderungPasswortZuruckSetzenInput } from "../graphql/apollo-gql";
import { FORMULAR_PASSWORT_RENDERN_MERKMALE } from "../SignUp/sign-up";
import { PasswortGleichPrüfer } from "../SignUp/sign-up";
import { AnfordernPasswortZuruckSetzenMerkmale } from "../graphql/anfordern-passwort-zuruck-setzen.veranderung";

export interface EigenesMerkmale
  extends RouteComponentProps<{ token: string }> {}

export type Merkmale = EigenesMerkmale &
  PasswortZuruckSetzenVeranderungMerkmale &
  AktualisierenAbfrageMerkmale &
  AnfordernPasswortZuruckSetzenMerkmale &
  FormikProps<VeranderungPasswortZuruckSetzenInput>;

export interface Zustand {
  email: string;
  emailError?: string;
  wirdGeladen?: boolean;
}

export const FORMULAR_RENDERN_MARKMALE: {
  [k in keyof VeranderungPasswortZuruckSetzenInput]: string[]
} = {
  ...FORMULAR_PASSWORT_RENDERN_MERKMALE,
  token: ["Token", "text"]
};

export const emailValidator = Yup.string()
  .required()
  .email("E-Mail ist ungültig");

export const formikConfig: WithFormikConfig<
  Merkmale,
  VeranderungPasswortZuruckSetzenInput
> = {
  handleSubmit: () => null,

  mapPropsToValues: ({
    match: {
      params: { token }
    }
  }) => {
    return {
      password: "",
      passwordConfirmation: "",
      token
    };
  },

  validationSchema: Yup.object<VeranderungPasswortZuruckSetzenInput>().shape({
    token: Yup.string()
      .required()
      .min(5),

    password: Yup.string()
      .min(4, "must be at least 4 characters")
      .max(50, "is too Long!")
      .required("is required"),

    passwordConfirmation: PasswortGleichPrüfer
  }),

  enableReinitialize: true,

  validateOnChange: false,

  validateOnBlur: false
};
