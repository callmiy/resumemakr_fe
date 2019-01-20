import React from "react";

import { Props } from "./preview";

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
  CreateSkillInput,
  CreateExperienceInput,
  EducationInput,
  GetResume_getResume_personalInfo
} from "../graphql/apollo-gql";

import { toServerUrl } from "../utils";

export class Preview extends React.Component<Props> {
  render() {
    const { getResume } = this.props;

    if (!getResume) {
      return;
    }

    const {
      skills,
      experiences,
      additionalSkills,
      education,
      hobbies,
      languages,
      personalInfo
    } = getResume;

    const { mode } = this.props;

    return (
      <Container data-testid="preview-resume-section" mode={mode}>
        <Left>
          {personalInfo && <PersonalInfo personalInfo={personalInfo} />}

          {additionalSkills && additionalSkills.length && (
            <Section>
              <TitleLeft>Additional Skills</TitleLeft>

              {additionalSkills.map((s, index) => (
                <div key={index}>{s && s.description}</div>
              ))}
            </Section>
          )}

          {languages && languages.length && (
            <Section>
              <TitleLeft>Languages</TitleLeft>

              {languages.map((s, index) => (
                <div key={index}>
                  {s && s.description} [{s && s.level}]
                </div>
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
          {experiences && experiences.length && (
            <Experiences experiences={experiences as CreateExperienceInput[]} />
          )}
          {education && education.length && (
            <Educations educations={education as EducationInput[]} />
          )}
        </Right>
      </Container>
    );
  }

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
}

export default Preview;

function PersonalInfo({
  personalInfo
}: {
  personalInfo: GetResume_getResume_personalInfo;
}) {
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
            <PersonalText>Date of birth</PersonalText>

            <PersonalText>{dateOfBirth}</PersonalText>
          </PersonalTitle>
        )}

        <PersonalTitle>
          <PersonalIcon name="map marker alternate" />

          {address &&
            address
              .split("\n")
              .map((addy, index) => (
                <PersonalText key={index}>{addy.trim()}</PersonalText>
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
          backgroundImg={`url(${toServerUrl(photo)})`}
          data-testid={`${firstName} ${lastName} photo`}
        />
      )}
    </>
  );
}

function Educations({ educations }: { educations: EducationInput[] }) {
  return (
    <Section>
      <TitleRight>Education</TitleRight>

      {educations.map((ed, index) => {
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
}

function Experiences({
  experiences
}: {
  experiences: CreateExperienceInput[];
}) {
  return (
    <Section>
      <TitleRight>Experience</TitleRight>

      {experiences.map((exp, index) => {
        const { position, achievements, fromDate, toDate, companyName } = exp;

        return (
          <div key={index} className="experience-container">
            <div className="left">
              {fromDate} {`- ${toDate || "present"}`}
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
}
