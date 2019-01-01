import * as Yup from "yup";

export type HobbyVal = string;

export const defaultVal: HobbyVal = "Swimming";

export const emptyVal: HobbyVal = "";

export const validationSchema = Yup.string();
