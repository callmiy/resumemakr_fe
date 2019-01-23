import React from "react";
import { Icon } from "semantic-ui-react";

import {
  CreateSkillInput,
  CreateExperienceInput,
  EducationInput,
  GetResume_getResume_personalInfo
} from "../graphql/apollo-gql";

import { Props, Mode } from "./preview";
import { Container, Img, Description, Ul, GlobalStyle } from "./preview-styles";
import { toServerUrl } from "../utils";

export class Preview extends React.Component<Props> {
  containerRef = React.createRef<HTMLDivElement>();

  componentDidUpdate() {
    const els = document.querySelectorAll(".right .break-here");

    if (!els.length) {
      return;
    }

    const { mode } = this.props;
    let sumHeight = 0;
    let totalHeight = 0;
    const maxHeights = {
      [Mode.download]: 850,
      [Mode.preview]: 1000
    };

    [].forEach.call(els, (el: HTMLElement, index: number) => {
      const h = getHeight(el);
      sumHeight += h;
      totalHeight += h;

      if (sumHeight >= maxHeights[mode]) {
        const id = "page-break" + index;

        if (!document.getElementById(id)) {
          const pageBreak = document.createElement("div");
          pageBreak.id = id;

          const classNames = ["html2pdf__page-break"];
          if (mode === Mode.preview) {
            classNames.push("preview");
          }

          pageBreak.classList.add(...classNames);
          el.before(pageBreak);
        }

        sumHeight = 0;
      }
    });

    const { current } = this.containerRef;

    if (mode === Mode.download && current) {
      current.style.height = 1120 * Math.ceil(totalHeight / 900) + "px";
    }
  }

  render() {
    const { getResume, loading, error } = this.props;

    if (loading) {
      return <div>loading</div>;
    }

    if (error) {
      return <div>{JSON.stringify(error)}</div>;
    }

    if (!getResume) {
      return <div>An error occurred</div>;
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
      <>
        {mode === Mode.download && <GlobalStyle />}

        <Container
          ref={this.containerRef}
          data-testid="preview-resume-section"
          mode={mode}
        >
          <div className="main-column left">
            {personalInfo && <PersonalInfo personalInfo={personalInfo} />}
            {additionalSkills && !!additionalSkills.length && (
              <div className="section-container">
                <h3 className="break-here section-title left">
                  Additional Skills
                </h3>

                {additionalSkills.map((s, index) => {
                  if (!s) {
                    return null;
                  }

                  const { description } = s;

                  if (!description) {
                    return null;
                  }

                  return (
                    <div key={index} className="break-here">
                      {description}
                    </div>
                  );
                })}
              </div>
            )}
            {languages && languages.length && (
              <div className="section-container">
                <h3 className="break-here section-title left">Languages</h3>

                {languages.map((s, index) => (
                  <div key={index} className="break-here">
                    {s && s.description} [{s && s.level}]
                  </div>
                ))}
              </div>
            )}
            {hobbies && hobbies.length && (
              <div className="section-container">
                <h3 className="break-here section-title left">Hobbies</h3>

                {hobbies.map((s, index) => (
                  <div key={index} className="break-here">
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="main-column right">
            {skills && this.renderSkills(skills)}

            {experiences && experiences.length && (
              <Experiences
                experiences={experiences as CreateExperienceInput[]}
              />
            )}
            {education && education.length && (
              <Educations educations={education as EducationInput[]} />
            )}
          </div>
        </Container>
      </>
    );
  }

  private renderSkills = (skills: Array<CreateSkillInput | null>) => {
    return (
      <div className="section-container">
        <h3 className="break-here section-title right skills">Skills</h3>

        {skills.map((skill, index) => {
          if (!skill) {
            return;
          }

          const { description } = skill;

          const [achievements, shouldRenderAchievements] = computeAchievements(
            skill.achievements
          );

          return (
            <React.Fragment key={index}>
              <Description className="break-here">{description}</Description>

              <Ul>
                {shouldRenderAchievements &&
                  achievements.map((achievement, ind) => (
                    <li key={ind} className="break-here li">
                      {achievement}
                    </li>
                  ))}
              </Ul>
            </React.Fragment>
          );
        })}
      </div>
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
      <div className="section-container">
        <h1 className="names-container">
          <span className="name">{firstName}</span>
          <span className="name">{lastName}</span>
        </h1>

        <div className="profession">{profession}</div>
      </div>

      <div className="section-container">
        <h3 className="section-title left">Personal Info</h3>

        {dateOfBirth && (
          <h4 className="personal-info">
            <Icon name="birthday" />

            <p>{dateOfBirth}</p>
          </h4>
        )}

        <h4 className="personal-info">
          <Icon name="map marker alternate" />

          {address &&
            address
              .split("\n")
              .map((addy, index) => <p key={index}>{addy.trim()}</p>)}
        </h4>

        <h4 className="personal-info">
          <Icon name="phone" />

          <p>{phone}</p>
        </h4>

        <h4 className="personal-info">
          <Icon name="mail" />

          <p>{email}</p>
        </h4>
      </div>

      {photo && (
        <Img
          className="photo"
          backgroundImg={`url(${toServerUrl(photo)})`}
          data-testid={`${firstName} ${lastName} photo`}
        />
      )}
    </>
  );
}

function Educations({ educations }: { educations: EducationInput[] }) {
  return (
    <div className="section-container">
      <h3 className="break-here section-title right">Education</h3>

      {educations.map((ed, index) => {
        const { course, school, fromDate, toDate } = ed;
        const [achievements, shouldRenderAchievements] = computeAchievements(
          ed.achievements
        );

        return (
          <div key={index} className="experience-container">
            <div className="left">
              {fromDate} {(toDate && `-${toDate}`) || ""}
            </div>

            <div className="right">
              <Description className="position break-here">
                {course}
              </Description>

              <div className="company break-here">{school}</div>

              {shouldRenderAchievements && (
                <Ul>
                  {achievements.map((achievement, ind) => {
                    return (
                      <li key={ind} className="break-here">
                        {achievement}
                      </li>
                    );
                  })}
                </Ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Experiences({
  experiences
}: {
  experiences: CreateExperienceInput[];
}) {
  return (
    <div className="section-container">
      <h3 className="break-here section-title right">Experience</h3>

      {experiences.map((exp, index) => {
        const { position, fromDate, toDate, companyName } = exp;
        const [achievements, shouldRenderAchievements] = computeAchievements(
          exp.achievements
        );

        return (
          <div key={index} className="experience-container">
            <div className="left">
              {fromDate} {`- ${toDate || "present"}`}
            </div>

            <div className="right">
              <Description className="position break-here">
                {position}
              </Description>

              <div className="company break-here">{companyName}</div>

              <Ul>
                {shouldRenderAchievements &&
                  achievements.map((achievement, ind) => {
                    return (
                      <li key={ind} className="break-here">
                        {achievement}
                      </li>
                    );
                  })}
              </Ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function computeAchievements(achievements: Array<string | null> | null = []) {
  achievements = (achievements || []).filter(a => !!a);
  return [achievements, !!achievements.length] as [string[], boolean];
}

function getHeight(el: HTMLElement) {
  const styles = window.getComputedStyle(el);
  return (
    parseFloat(styles.getPropertyValue("margin-top").replace("px", "")) +
    parseFloat(styles.getPropertyValue("margin-bottom").replace("px", "")) +
    el.offsetHeight
  );
}
