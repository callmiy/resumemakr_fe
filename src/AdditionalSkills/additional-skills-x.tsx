import React from "react";
import { Icon, Card } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { Section } from "../ResumeForm/resume-form";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { emptyVal } from "../Rated/rated";
import { RatedInput } from "../graphql/apollo-gql";

interface Props {
  label: Section;
  values?: Array<RatedInput | null> | null;
}

export class AdditionalSkills extends React.Component<Props, {}> {
  render() {
    const { label, values } = this.props;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="additional-skills-section"
        />

        <FieldArray
          name="additionalSkills"
          render={arrayHelper =>
            (values || [{ ...emptyVal }]).map((skill, index) => (
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

export default AdditionalSkills;

interface SkillProps {
  index: number;
  skill: RatedInput | null;
  arrayHelper: FieldArrayRenderProps;
}

function Skill({ index, skill, arrayHelper }: SkillProps) {
  if (!skill) {
    return null;
  }

  return (
    <Card>
      <Card.Content>
        <Card.Header>#{index + 1}</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name={makeName(index, "description")}
          label="Skill, description (e.g. Editing skills)"
          emptyValue={skill.description}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "level")}
          label="Rating description (e.g. Advanced) (optional)"
          emptyValue={skill.level}
          component={RegularField}
        />
      </Card.Content>
    </Card>
  );
}

function makeName(index: number, key: keyof RatedInput) {
  return `additionalSkills[${index}].${key}`;
}
