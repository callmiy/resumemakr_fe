export const ROOT_URL = "/";
export const LOGIN_URL = "/login";
export const SIGN_UP_URL = "/sign-up";
export const RESUME_PATH = "/resume/:title";

export enum ResumePathHash {
  edit = "#edit",
  preview = "#preview"
}

export function makeResumeRoute(
  title: string,
  hash: ResumePathHash = ResumePathHash.edit
) {
  return RESUME_PATH.replace(":title", encodeURIComponent(title)) + hash;
}
