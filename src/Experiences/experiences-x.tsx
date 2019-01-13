import React from "react";
import { TextArea, Card, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import {
  CreateExperienceInput,
  GetResume_getResume_experiences
} from "../graphql/apollo-gql";
import RegularField from "../RegularField";
import SectionLabel from "../SectionLabel";
import { Section } from "../ResumeForm/resume-form";
import { emptyVals } from "./experiences";
import { CircularLabel } from "../styles/mixins";
import { ExperienceHeader, ExperienceContainer } from "./experience.style";

interface Props {
  values: Array<CreateExperienceInput | null> | null | undefined;
  label: Section;
}

export class Experiences extends React.Component<Props, {}> {
  render() {
    const { label } = this.props;
    const values = (this.props.values || [{ ...emptyVals }]).sort((a, b) => {
      if (!(a || b)) {
        return 0;
      }

      const aId = Number((a as GetResume_getResume_experiences).id);

      if (!aId) {
        return 1;
      }

      const bId = Number((b as GetResume_getResume_experiences).id);

      if (!bId) {
        return -1;
      }

      return aId - bId;
    });

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
}

function Experience({ index, exp, arrayHelper, len }: ExperienceProps) {
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
            <CircularLabel color="blue">
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
              arrayHelper.insert(index1, { ...emptyVals });
            }}
          >
            <Icon name="add" />
          </CircularLabel>

          {index1 > 1 && (
            <CircularLabel color="blue">
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
              <CircularLabel color="blue">
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
              <CircularLabel color="blue">
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
