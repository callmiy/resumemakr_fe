import React from "react";

import { FormValues } from "../ResumeForm/resume-form";
import { Mode } from "./preview";

import {
  Container,
  Left,
  Section,
  NamePos,
  Name,
  Profession,
  TitleLeft,
  PersonalTitle,
  PersonalText,
  Img,
  Right,
  TitleRight,
  Description,
  Ul,
  PersonalIcon
} from "./preview-styles";
import {
  PersonalInfoInput,
  CreateSkillInput,
  CreateExperienceInput,
  EducationInput
} from "../graphql/apollo-gql";

interface Props {
  values: FormValues;
  mode: Mode;
}

export class Preview extends React.Component<Props> {
  render() {
    const {
      skills,
      experiences,
      additionalSkills,
      education,
      hobbies,
      languages,
      personalInfo
    } = this.props.values;

    const { mode } = this.props;

    return (
      <Container data-testid="preview-resume-section" mode={mode}>
        <Left>
          {personalInfo && this.renderPersonalInfo(personalInfo)}

          {additionalSkills && additionalSkills.length && (
            <Section>
              <TitleLeft>Additional Skills</TitleLeft>

              {additionalSkills.map((s, index) => (
                <span key={index}>{s && s.description}</span>
              ))}
            </Section>
          )}

          {languages && languages.length && (
            <Section>
              <TitleLeft>Languages</TitleLeft>

              {languages.map((s, index) => (
                <span key={index}>
                  {s && s.description} [{s && s.level}]
                </span>
              ))}
            </Section>
          )}

          {hobbies && hobbies.length && (
            <Section>
              <TitleLeft>Hobbies</TitleLeft>

              {hobbies.map((s, index) => (
                <span key={index}>{s}</span>
              ))}
            </Section>
          )}
        </Left>

        <Right>
          {skills && this.renderSkills(skills)}
          {experiences && this.renderExperiences(experiences)}
          {education && this.renderEducation(education)}
        </Right>
      </Container>
    );
  }

  private renderEducation = (education: Array<EducationInput | null>) => {
    return (
      <Section>
        <TitleRight>Education</TitleRight>

        {education.map((ed, index) => {
          if (!ed) {
            return;
          }

          const { course, school, fromDate, toDate, achievements } = ed;

          return (
            <div key={index} className="experience-container">
              <div className="left">
                {fromDate} {(toDate && `-${toDate}`) || ""}
              </div>

              <div className="right">
                <Description className="position">{course}</Description>

                <div className="company">{school}</div>

                {achievements && achievements.length && (
                  <Ul>
                    {achievements.map((achievement, ind) => (
                      <li key={ind}>{achievement}</li>
                    ))}
                  </Ul>
                )}
              </div>
            </div>
          );
        })}
      </Section>
    );
  };

  private renderExperiences = (
    experiences: Array<CreateExperienceInput | null>
  ) => {
    return (
      <Section>
        <TitleRight>Experience</TitleRight>

        {experiences.map((exp, index) => {
          if (!exp) {
            return null;
          }

          const { position, achievements, fromDate, toDate, companyName } = exp;

          return (
            <div key={index} className="experience-container">
              <div className="left">
                {fromDate} {(toDate && `-${toDate}`) || ""}
              </div>

              <div className="right">
                <Description className="position">{position}</Description>

                <div className="company">{companyName}</div>

                <Ul>
                  {achievements &&
                    achievements.map((achievement, ind) => (
                      <li key={ind}>{achievement}</li>
                    ))}
                </Ul>
              </div>
            </div>
          );
        })}
      </Section>
    );
  };

  private renderSkills = (skills: Array<CreateSkillInput | null>) => {
    return (
      <Section>
        <TitleRight>Skills</TitleRight>

        {skills.map((skill, index) => {
          if (!skill) {
            return;
          }

          const { description, achievements } = skill;

          return (
            <React.Fragment key={index}>
              <Description>{description}</Description>

              <Ul>
                {achievements &&
                  achievements.map((achievement, ind) => (
                    <li key={ind}>{achievement}</li>
                  ))}
              </Ul>
            </React.Fragment>
          );
        })}
      </Section>
    );
  };

  private renderPersonalInfo = (personalInfo: PersonalInfoInput) => {
    const {
      firstName,
      lastName,
      profession,
      address,
      phone,
      email,
      dateOfBirth,
      photo
    } = personalInfo;

    return (
      <>
        <Section>
          <NamePos>
            <Name>{firstName}</Name>
            <Name>{lastName}</Name>
          </NamePos>

          <Profession>{profession}</Profession>
        </Section>

        <Section>
          <TitleLeft>Personal Info</TitleLeft>

          {dateOfBirth && (
            <PersonalTitle>
              Phone
              <PersonalText>{dateOfBirth}</PersonalText>
            </PersonalTitle>
          )}

          <PersonalTitle>
            <PersonalIcon name="map marker alternate" />

            {address.split("\n").map((s, k) => (
              <PersonalText key={k}>{s.trim()}</PersonalText>
            ))}
          </PersonalTitle>

          <PersonalTitle>
            <PersonalIcon name="phone" />

            <PersonalText>{phone}</PersonalText>
          </PersonalTitle>

          <PersonalTitle>
            <PersonalIcon name="mail" />

            <PersonalText>{email}</PersonalText>
          </PersonalTitle>
        </Section>

        {photo && (
          <Img
            backgroundImg={photo}
            data-testid={`${firstName} ${lastName} photo`}
          />
        )}
      </>
    );
  };
}

export default Preview;
