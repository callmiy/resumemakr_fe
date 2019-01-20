import React from "react";
import { Icon, Card } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { Section, ChildProps } from "../ResumeForm/resume-form";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { emptyVal } from "../Rated/rated";
import { RatedInput, CreateExperienceInput } from "../graphql/apollo-gql";
import ListIndexHeader from "../ListIndexHeader";
import { SetFieldValue } from "../utils";

const headerLabelText = "Add. Skill";
let cachedValues: RatedInput[] = [];

interface Props extends ChildProps {
  label: Section;
  values?: Array<RatedInput | null> | null;
}

export class AdditionalSkills extends React.Component<Props, {}> {
  render() {
    const { label, setFieldValue } = this.props;
    const values = (this.props.values || [{ ...emptyVal }]) as RatedInput[];
    cachedValues = values;

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
                skill={skill}
                arrayHelper={arrayHelper}
                setFieldValue={setFieldValue}
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
  skill: RatedInput;
  arrayHelper: FieldArrayRenderProps;
  setFieldValue: SetFieldValue<CreateExperienceInput>;
}

function Skill({ skill, arrayHelper, setFieldValue }: SkillProps) {
  const { index, level, description } = skill;
  const fieldName = "additionalSkills";

  return (
    <Card>
      <ListIndexHeader
        index={index}
        label={""}
        idPrefix={headerLabelText}
        fieldName={fieldName}
        setFieldValue={setFieldValue}
        values={cachedValues as RatedInput[]}
        empty={emptyVal}
      />

      <Card.Content>
        <FastField
          name={makeName(index, "description")}
          label="Skill, description (e.g. Editing skills)"
          emptyValue={description}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "level")}
          label="Rating description (e.g. Advanced) (optional)"
          emptyValue={level}
          component={RegularField}
        />
      </Card.Content>
    </Card>
  );
}

function makeName(index: number, key: keyof RatedInput) {
  return `additionalSkills[${index - 1}].${key}`;
}
