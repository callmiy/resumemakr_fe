

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateResumeTitle
// ====================================================

export interface CreateResumeTitle_createResume_resume_additionalSkills {
  id: string;
  description: string;
  level: string | null;
  __typename: "Rated";
}

export interface CreateResumeTitle_createResume_resume_languages {
  id: string;
  description: string;
  level: string | null;
  __typename: "Rated";
}

export interface CreateResumeTitle_createResume_resume {
  id: string;  // The ID of an object
  title: string;
  description: string | null;
  __typename: "Resume";
  additionalSkills: (CreateResumeTitle_createResume_resume_additionalSkills | null)[] | null;
  languages: (CreateResumeTitle_createResume_resume_languages | null)[] | null;
}

export interface CreateResumeTitle_createResume {
  resume: CreateResumeTitle_createResume_resume | null;
}

export interface CreateResumeTitle {
  createResume: CreateResumeTitle_createResume | null;
}

export interface CreateResumeTitleVariables {
  input: CreateResumeInput;
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
// GraphQL mutation operation: UpdateResume
// ====================================================

export interface UpdateResume_updateResume_resume_additionalSkills {
  id: string;
  description: string;
  level: string | null;
  __typename: "Rated";
}

export interface UpdateResume_updateResume_resume_languages {
  id: string;
  description: string;
  level: string | null;
  __typename: "Rated";
}

export interface UpdateResume_updateResume_resume_personalInfo {
  id: string;
  address: string | null;
  dateOfBirth: any | null;
  email: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  photo: string | null;
  profession: string | null;
  __typename: "PersonalInfo";
}

export interface UpdateResume_updateResume_resume_experiences {
  id: string;
  achievements: (string | null)[] | null;
  companyName: string;
  fromDate: string;
  position: string;
  toDate: string | null;
  __typename: "ResumeExperience";
}

export interface UpdateResume_updateResume_resume_skills {
  id: string;
  description: string;
  achievements: (string | null)[] | null;
  __typename: "Skill";
}

export interface UpdateResume_updateResume_resume_education {
  id: string;
  course: string;
  fromDate: string;
  toDate: string | null;
  school: string;
  achievements: (string | null)[] | null;
  __typename: "Education";
}

export interface UpdateResume_updateResume_resume {
  id: string;  // The ID of an object
  title: string;
  description: string | null;
  __typename: "Resume";
  additionalSkills: (UpdateResume_updateResume_resume_additionalSkills | null)[] | null;
  languages: (UpdateResume_updateResume_resume_languages | null)[] | null;
  personalInfo: UpdateResume_updateResume_resume_personalInfo | null;
  experiences: (UpdateResume_updateResume_resume_experiences | null)[] | null;
  skills: (UpdateResume_updateResume_resume_skills | null)[] | null;
  education: (UpdateResume_updateResume_resume_education | null)[] | null;
}

export interface UpdateResume_updateResume {
  resume: UpdateResume_updateResume_resume | null;
}

export interface UpdateResume {
  updateResume: UpdateResume_updateResume | null;
}

export interface UpdateResumeVariables {
  input: UpdateResumeInput;
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
  id: string;
  description: string;
  level: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ResumeMinimalFrag
// ====================================================

export interface ResumeMinimalFrag_additionalSkills {
  id: string;
  description: string;
  level: string | null;
  __typename: "Rated";
}

export interface ResumeMinimalFrag_languages {
  id: string;
  description: string;
  level: string | null;
  __typename: "Rated";
}

export interface ResumeMinimalFrag {
  id: string;  // The ID of an object
  title: string;
  description: string | null;
  __typename: "Resume";
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
export interface CreateResumeInput {
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
export interface UpdateResumeInput {
  additionalSkills?: (RatedInput | null)[] | null;
  description?: string | null;
  education?: (EducationInput | null)[] | null;
  experiences?: (CreateExperienceInput | null)[] | null;
  id: string;
  languages?: (RatedInput | null)[] | null;
  personalInfo?: PersonalInfoInput | null;
  skills?: (CreateSkillInput | null)[] | null;
  title?: string | null;
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