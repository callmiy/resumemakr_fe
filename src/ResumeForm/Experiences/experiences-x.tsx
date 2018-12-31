import React from "react";
import { TextArea, Card, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { Experience, defaultVal } from "./experiences";
import RegularField from "../RegularField";
import SectionLabel from "../SectionLabel";
import { Section } from "../resume-form";

interface Props {
  values: Experience[];
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
              <Company
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

interface CompanyProps {
  index: number;
  exp?: Experience;
  arrayHelper: FieldArrayRenderProps;
}

function Company({
  index,
  exp = { ...defaultVal },
  arrayHelper
}: CompanyProps) {
  return (
    <Card>
      <Card.Content>
        <Card.Header>Company #{index + 1}</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name={makeName(index, "line1")}
          label="Line 1 (e.g. position)"
          defaultValue={exp.line1}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "line2")}
          label="Line 2 (e.g. company, department)"
          defaultValue={exp.line2}
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
          name={makeName(index, "texts")}
          render={helper => (
            <div>
              <div>Experiences</div>

              {exp.texts.map((text, ind) => (
                <ExperienceText
                  key={ind}
                  text={text}
                  textIndex={ind}
                  expFieldName={makeName(index, "texts")}
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

interface ExperienceTextProps {
  textIndex: number;
  text: string;
  expFieldName: string;
  arrayHelper: FieldArrayRenderProps;
}

function ExperienceText({
  textIndex,
  text,
  expFieldName
}: ExperienceTextProps) {
  const fieldName = `${expFieldName}[${textIndex}]`;
  return (
    <FastField
      name={fieldName}
      label={
        <div>
          {`# ${textIndex + 1}`}

          <label className="visually-hidden" htmlFor={fieldName}>
            Experience {textIndex + 1} text
          </label>
        </div>
      }
      defaultValue={text}
      comp={TextArea}
      component={RegularField}
    />
  );
}

function makeName(index: number, key: keyof Experience) {
  return `experiences[${index}].${key}`;
}
