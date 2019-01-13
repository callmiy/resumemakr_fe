import React from "react";
import { TextArea, Card, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { CreateExperienceInput } from "../graphql/apollo-gql";
import RegularField from "../RegularField";
import SectionLabel from "../SectionLabel";
import { Section } from "../ResumeForm/resume-form";
import { emptyVals } from "./experiences";
import { CircularLabel } from "../styles/mixins";
import { ExperienceHeader, ExperienceContainer } from "./experience.style";

type SetFieldValue = (
  field: string,
  value: Array<CreateExperienceInput | null>
) => void;

interface Props {
  values: Array<CreateExperienceInput | null> | null | undefined;
  label: Section;
  setFieldValue: SetFieldValue;
}

let allExperiences: Array<CreateExperienceInput | null> = [];

export class Experiences extends React.Component<Props, {}> {
  render() {
    const { label } = this.props;
    const values = (this.props.values || [{ ...emptyVals }]).sort((a, b) => {
      if (!a) {
        return 0;
      }

      if (!b) {
        return 0;
      }

      return a.index - b.index;
    });

    allExperiences = values;
    const { setFieldValue } = this.props;

    // tslint:disable-next-line:no-console
    console.log(
      "\n\t\tLogging start\n\n\n\n allExperiences\n",
      allExperiences,
      "\n\n\n\n\t\tLogging ends\n"
    );

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
                len={values.length}
                setFieldValue={setFieldValue}
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
  exp: CreateExperienceInput | null;
  arrayHelper: FieldArrayRenderProps;
  len: number;
  setFieldValue: SetFieldValue;
}

function Experience({
  index,
  exp,
  arrayHelper,
  len,
  setFieldValue
}: ExperienceProps) {
  if (!exp) {
    return null;
  }

  let achievements = exp.achievements || [""];

  if (achievements.length === 0) {
    achievements = [""];
  }

  const index1 = index + 1;

  return (
    <ExperienceContainer>
      <ExperienceHeader>
        <Card.Header>Company #{index1}</Card.Header>

        <div>
          {len > 1 && (
            <CircularLabel
              color="blue"
              onClick={function onSwapExperienceDown() {
                setFieldValue("experiences", swap(index, index1));
              }}
            >
              <Icon name="arrow down" />
            </CircularLabel>
          )}

          {len > 1 && (
            <CircularLabel
              color="red"
              onClick={function onRemoveEmployee() {
                arrayHelper.remove(index);
              }}
            >
              <Icon name="remove" />
            </CircularLabel>
          )}

          <CircularLabel
            color="green"
            onClick={function onAddEmployee() {
              arrayHelper.insert(index1, { ...emptyVals, index: len + 1 });
            }}
          >
            <Icon name="add" />
          </CircularLabel>

          {index1 > 1 && (
            <CircularLabel
              color="blue"
              onClick={function onSwapExperienceUp() {
                setFieldValue("experiences", swap(index, index - 1));
              }}
            >
              <Icon name="arrow up" />
            </CircularLabel>
          )}
        </div>
      </ExperienceHeader>

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
          name={makeName(index, "fromDate")}
          label="Date from"
          defaultValue={exp.fromDate}
          component={RegularField}
        />

        <FastField
          name={makeName(index, "toDate")}
          label="Date to (optional)"
          defaultValue={exp.toDate}
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

              {achievements.map((achievement, ind) => (
                <Achievement
                  key={ind}
                  achievement={achievement}
                  index={ind}
                  fieldName={makeName(index, "achievements")}
                  arrayHelper={helper}
                  expIndex1={index}
                  len={achievements.length}
                />
              ))}
            </div>
          )}
        />
      </Card.Content>
    </ExperienceContainer>
  );
}

interface AchievementProps {
  index: number;
  achievement: string | null;
  fieldName: string;
  arrayHelper: FieldArrayRenderProps;
  expIndex1: number;
  len: number;
}

function Achievement({
  index,
  achievement,
  fieldName: expFieldName,
  expIndex1,
  arrayHelper,
  len
}: AchievementProps) {
  const fieldName = `${expFieldName}[${index}]`;
  const index1 = index + 1;

  return (
    <FastField
      name={fieldName}
      label={
        <div className="with-controls achievement-header ">
          {`# ${index1}`}

          <div>
            {len > 1 && (
              <CircularLabel
                color="blue"
                onClick={function onSwapAchievementsUp() {
                  arrayHelper.swap(index, index1);
                }}
              >
                <Icon name="arrow down" />
              </CircularLabel>
            )}

            {len > 1 && (
              <CircularLabel
                color="red"
                onClick={function onRemoveAchievement() {
                  arrayHelper.remove(index);
                }}
              >
                <Icon name="remove" />
              </CircularLabel>
            )}

            <CircularLabel
              color="green"
              onClick={function onAddAchievement() {
                arrayHelper.insert(index1, "");
              }}
            >
              <Icon name="add" />
            </CircularLabel>

            {index1 > 1 && (
              <CircularLabel
                color="blue"
                onClick={function onSwapAchievementsUp() {
                  arrayHelper.swap(index, index - 1);
                }}
              >
                <Icon name="arrow up" />
              </CircularLabel>
            )}
          </div>

          <label className="visually-hidden" htmlFor={fieldName}>
            Experience {expIndex1} achievement {index1}
          </label>
        </div>
      }
      defaultValue={achievement}
      comp={TextArea}
      component={RegularField}
    />
  );
}

function makeName(index: number, key: keyof CreateExperienceInput) {
  return `experiences[${index}].${key}`;
}

function swap(indexA: number, indexB: number) {
  return allExperiences.map(e => {
    if (!e) {
      return e;
    }

    const index = e.index - 1;

    if (index === indexA) {
      e.index = indexB + 1;
    } else if (index === indexB) {
      e.index = indexA + 1;
    }

    return e;
  });
}
