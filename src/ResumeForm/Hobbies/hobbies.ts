import * as Yup from "yup";

export type Hobby = string;

export const defaultVal: Hobby = "Swimming";

export const emptyVal: Hobby = "";

export const validationSchema = Yup.string();
