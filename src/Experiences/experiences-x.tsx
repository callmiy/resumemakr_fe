import React from "react";
import { TextArea, Card, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { ExperienceVal } from "./experiences";
import RegularField from "../RegularField";
import SectionLabel from "../SectionLabel";
import { Section } from "../ResumeForm/resume-form";

interface Props {
  values: ExperienceVal[];
  label: Section;
}

export class Experiences extends React.Component<Props, {}> {
  render() {
    const { values, label } = this.props;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="experiences-section"
        />

        <FieldArray
          name="experiences"
          render={arrayHelper =>
            values.map((exp, index) => (
              <Experience
                key={index}
                index={index}
                exp={exp}
                arrayHelper={arrayHelper}
              />
            ))
          }
        />
      </>
    );
  }
}

export default Experiences;

interface ExperienceProps {
  index: number;
  exp: ExperienceVal;
  arrayHelper: FieldArrayRenderProps;
}

function Experience({ index, exp, arrayHelper }: ExperienceProps) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>Company #{index + 1}</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name={makeName(index, "position")}
          label="Title/Position/Responsibility"
          defaultValue={exp.position}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "companyName")}
          label="Company, department etc."
          defaultValue={exp.companyName}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "from_date")}
          label="Date from"
          defaultValue={exp.from_date}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "to_date")}
          label="Date to (optional)"
          defaultValue={exp.to_date}
          component={RegularField}
        />

        <FieldArray
          name={makeName(index, "achievements")}
          render={helper => (
            <div>
              <div>
                Achievements
                <span> (responsibilities, activities)</span>
              </div>

              {exp.achievements.map((achievement, ind) => (
                <Achievement
                  key={ind}
                  achievement={achievement}
                  index={ind}
                  fieldName={makeName(index, "achievements")}
                  arrayHelper={helper}
                  expIndex1={index}
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
  index: number;
  achievement: string;
  fieldName: string;
  arrayHelper: FieldArrayRenderProps;
  expIndex1: number;
}

function Achievement({
  index,
  achievement,
  fieldName: expFieldName,
  expIndex1
}: AchievementProps) {
  const fieldName = `${expFieldName}[${index}]`;

  return (
    <FastField
      name={fieldName}
      label={
        <div>
          {`# ${index + 1}`}

          <label className="visually-hidden" htmlFor={fieldName}>
            Experience {expIndex1} achievement {index + 1}
          </label>
        </div>
      }
      defaultValue={achievement}
      comp={TextArea}
      component={RegularField}
    />
  );
}

function makeName(index: number, key: keyof ExperienceVal) {
  return `experiences[${index}].${key}`;
}
