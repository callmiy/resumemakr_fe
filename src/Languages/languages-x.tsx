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

export class Languages extends React.Component<Props, {}> {
  render() {
    const { label, values = [] } = this.props;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="languages-section"
        />

        <FieldArray
          name="languages"
          render={arrayHelper =>
            (values || [{ ...emptyVal }]).map((lang, index) => (
              <Language
                key={index}
                index={index}
                lang={lang}
                arrayHelper={arrayHelper}
              />
            ))
          }
        />
      </>
    );
  }
}

export default Languages;

interface LangProps {
  index: number;
  lang: RatedInput | null;
  arrayHelper: FieldArrayRenderProps;
}

function Language({ index, lang, arrayHelper }: LangProps) {
  if (!lang) {
    return null;
  }

  return (
    <Card>
      <Card.Content>
        <Card.Header>School #{index + 1}</Card.Header>
      </Card.Content>

      <Card.Content>
        <FastField
          name={makeName(index, "description")}
          label="Language, description (e.g. Spanish - Certified)"
          defaultValue={lang.description}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "level")}
          label="Rating description (e.g. Proficient) (optional)"
          defaultValue={lang.level}
          component={RegularField}
        />
      </Card.Content>
    </Card>
  );
}

function makeName(index: number, key: keyof RatedInput) {
  return `languages[${index}].${key}`;
}
