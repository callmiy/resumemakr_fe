

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateResumeTitle
// ====================================================

export interface CreateResumeTitle_resume_resume_additionalSkills {
  description: string;
  level: string | null;
}

export interface CreateResumeTitle_resume_resume_languages {
  description: string;
  level: string | null;
}

export interface CreateResumeTitle_resume_resume {
  id: string;  // The ID of an object
  title: string;
  description: string | null;
  additionalSkills: (CreateResumeTitle_resume_resume_additionalSkills | null)[] | null;
  languages: (CreateResumeTitle_resume_resume_languages | null)[] | null;
}

export interface CreateResumeTitle_resume {
  resume: CreateResumeTitle_resume_resume | null;
}

export interface CreateResumeTitle {
  resume: CreateResumeTitle_resume | null;
}

export interface CreateResumeTitleVariables {
  input: ResumeInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteResume
// ====================================================

export interface DeleteResume_deleteResume_resume {
  id: string;  // The ID of an object
  title: string;
}

export interface DeleteResume_deleteResume {
  resume: DeleteResume_deleteResume_resume | null;
}

export interface DeleteResume {
  deleteResume: DeleteResume_deleteResume | null;
}

export interface DeleteResumeVariables {
  input: DeleteResumeInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginMutation
// ====================================================

export interface LoginMutation_login_user {
  id: string;  // The ID of an object
  name: string;
  email: string;
  jwt: string;
}

export interface LoginMutation_login {
  user: LoginMutation_login_user | null;
}

export interface LoginMutation {
  login: LoginMutation_login | null;
}

export interface LoginMutationVariables {
  input: LoginInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResumeTitles
// ====================================================

export interface ResumeTitles_resumes_edges_node {
  id: string;  // The ID of an object
  title: string;
  updatedAt: any;
  __typename: "Resume";
}

export interface ResumeTitles_resumes_edges {
  node: ResumeTitles_resumes_edges_node | null;  // The item at the end of the edge
}

export interface ResumeTitles_resumes {
  edges: (ResumeTitles_resumes_edges | null)[] | null;
  __typename: "ResumeConnection";
}

export interface ResumeTitles {
  resumes: ResumeTitles_resumes | null;  // query a resume
}

export interface ResumeTitlesVariables {
  howMany: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UserRegMutation
// ====================================================

export interface UserRegMutation_registration_user {
  id: string;  // The ID of an object
  name: string;
  email: string;
  jwt: string;
}

export interface UserRegMutation_registration {
  user: UserRegMutation_registration_user | null;
}

export interface UserRegMutation {
  registration: UserRegMutation_registration | null;
}

export interface UserRegMutationVariables {
  input: RegistrationInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ResumeTitlesFrag
// ====================================================

export interface ResumeTitlesFrag_edges_node {
  id: string;  // The ID of an object
  title: string;
  updatedAt: any;
  __typename: "Resume";
}

export interface ResumeTitlesFrag_edges {
  node: ResumeTitlesFrag_edges_node | null;  // The item at the end of the edge
}

export interface ResumeTitlesFrag {
  edges: (ResumeTitlesFrag_edges | null)[] | null;
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
  id: string;  // The ID of an object
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
  id: string;  // The ID of an object
  name: string;
  email: string;
  jwt: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

// null
export interface ResumeInput {
  additionalSkills?: (RatedInput | null)[] | null;
  description?: string | null;
  education?: (EducationInput | null)[] | null;
  experiences?: (CreateExperienceInput | null)[] | null;
  languages?: (RatedInput | null)[] | null;
  personalInfo?: PersonalInfoInput | null;
  skills?: (CreateSkillInput | null)[] | null;
  title: string;
}

// Variables for creating an object with a rating
export interface RatedInput {
  description: string;
  id?: string | null;
  level?: string | null;
}

// Variables for creating resume education
export interface EducationInput {
  achievements?: (string | null)[] | null;
  course: string;
  fromDate: string;
  id?: string | null;
  school: string;
  toDate?: string | null;
}

// Variables for creating resume experience
export interface CreateExperienceInput {
  achievements?: (string | null)[] | null;
  companyName: string;
  fromDate: string;
  id?: string | null;
  position: string;
  toDate?: string | null;
}

// Variables for creating Personal Info
export interface PersonalInfoInput {
  address: string;
  dateOfBirth?: any | null;
  email: string;
  firstName: string;
  id?: string | null;
  lastName: string;
  phone: string;
  photo?: string | null;
  profession: string;
}

// A resume skill
export interface CreateSkillInput {
  achievements?: (string | null)[] | null;
  description: string;
  id?: string | null;
}

// null
export interface DeleteResumeInput {
  id: string;
}

// null
export interface LoginInput {
  email: string;
  password: string;
}

// null
export interface RegistrationInput {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  source: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================