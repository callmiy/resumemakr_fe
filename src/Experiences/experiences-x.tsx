import React from "react";
import { TextArea, Card, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField, FieldArray } from "formik";

import { CreateExperienceInput } from "../graphql/apollo-gql";
import RegularField from "../RegularField";
import SectionLabel from "../SectionLabel";
import { emptyVals, Props } from "./experiences";
import { CircularLabel } from "../styles/mixins";
import { ExperienceHeader, ExperienceContainer } from "./experience.style";

let allExperiences: Array<CreateExperienceInput | null> = [];
let len = 0;

export class Experiences extends React.Component<Props, {}> {
  componentDidMount() {
    this.scrollToExperience();
  }

  componentDidUpdate() {
    this.scrollToExperience();
  }

  componentWillUnmount() {
    allExperiences = (undefined as unknown) as Array<CreateExperienceInput | null>;
  }

  render() {
    const { label } = this.props;
    const values = this.props.values || [{ ...emptyVals }];
    allExperiences = values;
    len = values.length;

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="won" />}
          data-testid="experiences-section"
        />

        <FieldArray
          name="experiences"
          render={arrayHelper => values.map(this.renderExperience(arrayHelper))}
        />
      </>
    );
  }

  private renderExperience = (arrayHelper: FieldArrayRenderProps) => (
    exp: CreateExperienceInput | null
  ) => {
    if (!exp) {
      return null;
    }

    const { setFieldValue } = this.props;
    /**
     * index is 1-based
     */
    const { index } = exp;

    let achievements = exp.achievements || [""];

    if (achievements.length === 0) {
      achievements = [""];
    }

    const id = "company-" + index;

    return (
      <ExperienceContainer key={id}>
        <ExperienceHeader>
          <Card.Header id={id}>Company #{index}</Card.Header>

          <div>
            {len > index && (
              <CircularLabel
                color="blue"
                onClick={function onSwapExperienceDown() {
                  setFieldValue("experiences", swap(index, index + 1));
                }}
              >
                <Icon name="arrow down" />
              </CircularLabel>
            )}

            {len > 1 && (
              <CircularLabel
                color="red"
                onClick={function onRemoveEmployee() {
                  setFieldValue("experiences", remove(index));
                }}
              >
                <Icon name="remove" />
              </CircularLabel>
            )}

            <CircularLabel
              color="green"
              onClick={function onAddEmployee() {
                setFieldValue("experiences", add(index));
              }}
            >
              <Icon name="add" />
            </CircularLabel>

            {index > 1 && (
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

function swap(indexA: number, indexB: number) {
  return allExperiences.map(e => {
    if (!e) {
      return e;
    }

    const index = e.index;

    if (index === indexA) {
      e.index = indexB;
    } else if (index === indexB) {
      e.index = indexA;
    }

    return e;
  });
}

function remove(index: number) {
  return allExperiences.reduce(
    (acc, exp, ind) => {
      if (!exp) {
        return acc;
      }

      const expInd = exp.index;

      if (expInd < index) {
        acc[ind] = exp;
      } else if (expInd > index) {
        exp.index = ind;
        acc[ind - 1] = exp;
      }

      return acc;
    },
    [] as Array<CreateExperienceInput | null>
  );
}

function add(index: number) {
  if (len === index) {
    return [...allExperiences, { ...emptyVals, index: index + 1 }];
  }

  return allExperiences.reduce(
    (acc, exp, ind) => {
      if (!exp) {
        return acc;
      }

      const expInd = exp.index;

      if (expInd < index) {
        acc[ind] = exp;
      } else if (expInd === index) {
        acc[ind] = exp;
        acc[ind + 1] = { ...emptyVals, index: index + 1 };
      } else if (expInd > index) {
        exp.index = expInd + 1;
        acc[ind + 1] = exp;
      }

      return acc;
    },
    [] as Array<CreateExperienceInput | null>
  );
}
