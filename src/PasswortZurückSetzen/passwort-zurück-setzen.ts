import { RouteComponentProps } from "react-router-dom";
import * as Yup from "yup";

import { PasswortZuruckSetzenMerkmale } from "../graphql/passwort_zurück_setzen.veränderung";
import { AktualisierenAbfrageMerkmale } from "../graphql/aktualisieren.abfrage";
import { PasswortZuruckSetzenInput } from "../graphql/apollo-gql";
import { FORMULAR_PASSWORT_RENDERN_MERKMALE } from "../SignUp/sign-up";
import { PasswortGleichPrüfer } from "../SignUp/sign-up";
import { AnfordernPasswortZuruckSetzenMerkmale } from "../graphql/anfordern-passwort-zuruck-setzen.veranderung";

export interface EigenesMerkmale
  extends RouteComponentProps<{ token: string }> {}

export interface Merkmale
  extends EigenesMerkmale,
    PasswortZuruckSetzenMerkmale,
    AktualisierenAbfrageMerkmale,
    AnfordernPasswortZuruckSetzenMerkmale {}

export interface Zustand {
  email: string;
  emailError?: string;
  wirdGeladen?: boolean;
}

export const FORMULAR_RENDERN_MARKMALE: {
  [k in keyof PasswortZuruckSetzenInput]: string[]
} = {
  ...FORMULAR_PASSWORT_RENDERN_MERKMALE,
  token: ["Token", "text"]
};

export const ValidationSchema = Yup.object<PasswortZuruckSetzenInput>().shape({
  token: Yup.string()
    .required()
    .min(5),

  password: Yup.string()
    .min(4, "must be at least 4 characters")
    .max(50, "is too Long!")
    .required("is required"),

  passwordConfirmation: PasswortGleichPrüfer
});

export const emailValidator = Yup.string()
  .required()
  .email("email is invalid");
