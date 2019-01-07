

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateResumeTitle
// ====================================================

export interface CreateResumeTitle_resume_additionalSkills {
  description: string;
  level: string | null;
}

export interface CreateResumeTitle_resume_languages {
  description: string;
  level: string | null;
}

export interface CreateResumeTitle_resume {
  id: string;
  title: string;
  description: string | null;
  additionalSkills: (CreateResumeTitle_resume_additionalSkills | null)[] | null;
  languages: (CreateResumeTitle_resume_languages | null)[] | null;
}

export interface CreateResumeTitle {
  resume: CreateResumeTitle_resume | null;
}

export interface CreateResumeTitleVariables {
  resume: ResumeInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginMutation
// ====================================================

export interface LoginMutation_login {
  id: string;
  name: string;
  email: string;
  jwt: string;
}

export interface LoginMutation {
  login: LoginMutation_login | null;
}

export interface LoginMutationVariables {
  login: LoginUser;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UserRegMutation
// ====================================================

export interface UserRegMutation_registration {
  id: string;
  name: string;
  email: string;
  jwt: string;
}

export interface UserRegMutation {
  registration: UserRegMutation_registration | null;
}

export interface UserRegMutationVariables {
  registration: Registration;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RatedFrag
// ====================================================

export interface RatedFrag {
  description: string;
  level: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ResumeMinimalFrag
// ====================================================

export interface ResumeMinimalFrag_additionalSkills {
  description: string;
  level: string | null;
}

export interface ResumeMinimalFrag_languages {
  description: string;
  level: string | null;
}

export interface ResumeMinimalFrag {
  id: string;
  title: string;
  description: string | null;
  additionalSkills: (ResumeMinimalFrag_additionalSkills | null)[] | null;
  languages: (ResumeMinimalFrag_languages | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserFragment
// ====================================================

export interface UserFragment {
  id: string;
  name: string;
  email: string;
  jwt: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

// Variables for creating Resume
export interface ResumeInput {
  additionalSkills?: (RatedInput | null)[] | null;
  description?: string | null;
  education?: (EducationInput | null)[] | null;
  experiences?: (ResumeExperienceInput | null)[] | null;
  languages?: (RatedInput | null)[] | null;
  personalInfo?: PersonalInfoInput | null;
  title: string;
}

// Variables for creating an object with a rating
export interface RatedInput {
  description: string;
  level?: string | null;
}

// Variables for creating resume education
export interface EducationInput {
  achievements?: (string | null)[] | null;
  course: string;
  fromDate: string;
  school: string;
  toDate?: string | null;
}

// Variables for creating resume experience
export interface ResumeExperienceInput {
  achievements?: (string | null)[] | null;
  companyName: string;
  fromDate: string;
  position: string;
  toDate?: string | null;
}

// Variables for creating Personal Info
export interface PersonalInfoInput {
  address: string;
  dateOfBirth?: any | null;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  photo?: string | null;
  profession: string;
}

// Variables for login in User
export interface LoginUser {
  email: string;
  password: string;
}

// Variables for creating User and credential
export interface Registration {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  source: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================