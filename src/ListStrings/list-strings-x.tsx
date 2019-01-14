import React from "react";
import { TextArea, Icon } from "semantic-ui-react";
import { FieldArrayRenderProps, FastField } from "formik";

import { CircularLabel } from "../styles/mixins";
import RegularField from "../RegularField";

interface ListStringsProps {
  values: string[];
  fieldName: string;
  arrayHelper: FieldArrayRenderProps;
  hiddenLabel?: string;
  header?: JSX.Element;
}

export function ListStrings({
  values,
  fieldName: parentFieldName,
  arrayHelper,
  hiddenLabel,
  header
}: ListStringsProps) {
  const valuesLen = values.length;

  return (
    <div>
      {header && header}

      {values.map((value, index) => {
        const fieldName = `${parentFieldName}[${index}]`;
        const index1 = index + 1;

        return (
          <FastField
            key={index}
            name={fieldName}
            label={
              <div className="with-controls list-string-header ">
                {`# ${index1}`}

                <div>
                  {valuesLen > 1 && (
                    <CircularLabel
                      color="blue"
                      onClick={function onSwapAchievementsUp() {
                        arrayHelper.swap(index, index1);
                      }}
                    >
                      <Icon name="arrow down" />
                    </CircularLabel>
                  )}

                  {valuesLen > 1 && (
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
                  {hiddenLabel && hiddenLabel}
                </label>
              </div>
            }
            defaultValue={value}
            comp={TextArea}
            component={RegularField}
          />
        );
      })}
    </div>
  );
}

export default ListStrings;
