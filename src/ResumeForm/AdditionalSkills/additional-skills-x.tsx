import React from "react";
import { Icon, Card } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { Section } from "../resume-form";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { AdditionalSkillVal, defaultValue } from "./additional-skills";

interface Props {
  label: Section;
  values: AdditionalSkillVal[];
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

export default AdditionalSkills;

interface SkillProps {
  index: number;
  skill?: AdditionalSkillVal;
  arrayHelper: FieldArrayRenderProps;
}

function Skill({
  index,
  skill = { ...defaultValue },
  arrayHelper
}: SkillProps) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>School #{index + 1}</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name={makeName(index, "description")}
          label="Skill, description (e.g. Editing skills)"
          defaultValue={skill.description}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "ratingDescription")}
          label="Rating description (e.g. Advanced) (optional)"
          defaultValue={skill.ratingDescription}
          component={RegularField}
        />
      </Card.Content>
    </Card>
  );
}

function makeName(index: number, key: keyof AdditionalSkillVal) {
  return `additionalSkills[${index}].${key}`;
}
