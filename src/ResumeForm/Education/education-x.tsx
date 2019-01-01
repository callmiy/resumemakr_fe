import React from "react";
import { Icon, Card } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { Section } from "../resume-form";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import { EducationVal, defaultVal } from "./education";

interface Props {
  label: Section;
  values: EducationVal[];
}

export class Education extends React.Component<Props, {}> {
  render() {
    const { label, values } = this.props;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="education-section"
        />

        <FieldArray
          name="education"
          render={arrayHelper =>
            values.map((edu, index) => (
              <School
                key={index}
                index={index}
                edu={edu}
                arrayHelper={arrayHelper}
              />
            ))
          }
        />
      </>
    );
  }
}

export default Education;

interface SchoolProps {
  index: number;
  edu?: EducationVal;
  arrayHelper: FieldArrayRenderProps;
}

function School({ index, edu = { ...defaultVal }, arrayHelper }: SchoolProps) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>School #{index + 1}</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name={makeName(index, "school")}
          label="School name, location"
          defaultValue={edu.school}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "course")}
          label="Major, minor, degree"
          defaultValue={edu.course}
          component={RegularField}
        />
      </Card.Content>
    </Card>
  );
}

function makeName(index: number, key: keyof EducationVal) {
  return `education[${index}].${key}`;
}
