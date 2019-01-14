import React from "react";
import { TextArea, Card, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { CreateExperienceInput } from "../graphql/apollo-gql";
import RegularField from "../RegularField";
import SectionLabel from "../SectionLabel";
import { emptyVals, Props } from "./experiences";
import { CircularLabel } from "../styles/mixins";
import { ExperienceContainer } from "./experience.style";
import ListIndexHeader from "../ListIndexHeader";

let allExperiences: Array<CreateExperienceInput | null> = [];
const HeaderLabelText = "Company";

export class Experiences extends React.Component<Props, {}> {
  componentDidMount() {
    this.scrollToExperience();
  }

  componentDidUpdate() {
    this.scrollToExperience();
  }

  componentWillUnmount() {
    allExperiences = (null as unknown) as Array<CreateExperienceInput | null>;
  }

  render() {
    const { label } = this.props;
    const values = this.props.values || [{ ...emptyVals }];
    allExperiences = values;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="experiences-section"
        />

        <FieldArray
          name="experiences"
          render={arrayHelper => values.map(this.renderExperience)}
        />
      </>
    );
  }

  private renderExperience = (exp: CreateExperienceInput | null) => {
    exp = exp as CreateExperienceInput;

    const { setFieldValue } = this.props;
    /**
     * index is 1-based
     */
    const { index } = exp;

    let achievements = exp.achievements || [""];

    if (achievements.length === 0) {
      achievements = [""];
    }

    return (
      <ExperienceContainer key={index}>
        <ListIndexHeader
          index={index}
          label={HeaderLabelText}
          fieldName="experiences"
          setFieldValue={setFieldValue}
          values={allExperiences as CreateExperienceInput[]}
          empty={emptyVals}
        />

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
                    achievementsLen={achievements.length}
                  />
                ))}
              </div>
            )}
          />
        </Card.Content>
      </ExperienceContainer>
    );
  };

  private scrollToExperience = () => {
    const {
      location: { hash }
    } = this.props;
    const id = hash.split("/")[2];

    if (!id) {
      return;
    }

    const $id =
      document.getElementById(id) || document.getElementById("company-1");

    if (!$id) {
      return;
    }

    $id.scrollIntoView({
      behavior: "auto",
      block: "start",
      inline: "start"
    });
  };
}

export default Experiences;

interface AchievementProps {
  index: number;
  achievement: string | null;
  fieldName: string;
  arrayHelper: FieldArrayRenderProps;
  expIndex1: number;
  achievementsLen: number;
}

function Achievement({
  index,
  achievement,
  fieldName: expFieldName,
  expIndex1,
  arrayHelper,
  achievementsLen
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
            {achievementsLen > 1 && (
              <CircularLabel
                color="blue"
                onClick={function onSwapAchievementsUp() {
                  arrayHelper.swap(index, index1);
                }}
              >
                <Icon name="arrow down" />
              </CircularLabel>
            )}

            {achievementsLen > 1 && (
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

/**
 * index is 1-based
 */
function makeName(index: number, key: keyof CreateExperienceInput) {
  return `experiences[${index - 1}].${key}`;
}
