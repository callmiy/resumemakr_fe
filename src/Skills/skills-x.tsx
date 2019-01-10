import React from "react";
import { Icon, Card, TextArea } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { Section } from "../ResumeForm/resume-form";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { SkillVal } from "./skills";

interface Props {
  label: Section;
  values: SkillVal[];
}

export class Skills extends React.Component<Props, {}> {
  render() {
    const { label, values } = this.props;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="skills-section"
        />

        <FieldArray
          name="skills"
          render={arrayHelper =>
            values.map((skill, index) => (
              <Skill
                key={index}
                index={index}
                skill={skill}
                arrayHelper={arrayHelper}
              />
            ))
          }
        />
      </>
    );
  }
}

export default Skills;

interface SkillProps {
  index: number;
  skill: SkillVal;
  arrayHelper: FieldArrayRenderProps;
}

function Skill({ index, skill, arrayHelper }: SkillProps) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>Skill #{index + 1}</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name={makeName(index, "description")}
          label="Description (e.g Leadership)"
          defaultValue={skill.description}
          component={RegularField}
        />

        <FieldArray
          name={makeName(index, "achievements")}
          render={helper => (
            <div>
              <div>Achievements</div>

              {skill.achievements.map((text, ind) => (
                <Achievement
                  key={ind}
                  text={text}
                  textIndex={ind}
                  fieldName={makeName(index, "achievements")}
                  arrayHelper={helper}
                />
              ))}
            </div>
          )}
        />
      </Card.Content>
    </Card>
  );
}

interface AchievementProps {
  textIndex: number;
  text: string;
  fieldName: string;
  arrayHelper: FieldArrayRenderProps;
}

function Achievement({
  textIndex,
  text,
  fieldName: fieldName1
}: AchievementProps) {
  const fieldName = `${fieldName1}[${textIndex}]`;

  return (
    <FastField
      name={fieldName}
      label={
        <div>
          {`# ${textIndex + 1}`}

          <label className="visually-hidden" htmlFor={fieldName}>
            Achievement {textIndex + 1} text
          </label>
        </div>
      }
      defaultValue={text}
      comp={TextArea}
      component={RegularField}
    />
  );
}

function makeName(index: number, key: keyof SkillVal) {
  return `skills[${index}].${key}`;
}
