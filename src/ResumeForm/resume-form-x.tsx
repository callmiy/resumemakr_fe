import React from "react";
import { Form, Icon } from "semantic-ui-react";
import { Cancelable } from "lodash";
import lodashDebounce from "lodash/debounce";
import lodashIsEqual from "lodash/isEqual";
import lodashIsEmpty from "lodash/isEmpty";
import update from "immutability-helper";

import {
  FormValues,
  Section,
  toSection,
  sectionsList,
  Props,
  getInitialValues,
  State,
  FormContextProvider
} from "./resume-form";

import {
  PreviewBtn,
  PreviewBtnIcon,
  EditBtn,
  PrevBtnIcon,
  NextBtn,
  NextBtnIcon,
  Container
} from "./resume-form-styles";

import { ToolTip } from "../styles/mixins";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import PersonalInfo from "../PersonalInfo";
import Experiences from "../Experiences";
import Education from "../Education";
import Hobbies from "../Hobbies";
import Skills from "../Skills";
import Loading from "../Loading";
import { ALREADY_UPLOADED } from "../constants";
import { UpdateResumeInput } from "../graphql/apollo-gql";
import { ResumePathHash } from "../routing";
import logger from "../logger";
import Rated from "../Rated";

let valuesTracker: FormValues | null = null;
let debounceUpdateResume: (ResumeForm["updateResume"] & Cancelable) | undefined;
let currentSection: Section = Section.personalInfo;
let backToSection: Section = Section.personalInfo;

export class ResumeForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    debounceUpdateResume = lodashDebounce<ResumeForm["updateResume"]>(
      this.updateResume,
      500
    );

    this.state = {
      valueChanged: this.valueChanged
    };
  }

  componentDidMount() {
    valuesTracker = this.props.values;
  }

  componentWillUnmount() {
    if (debounceUpdateResume) {
      debounceUpdateResume.cancel();
    }
  }

  render() {
    const { loading, error: graphQlLoadingError, values } = this.props;
    currentSection = this.sectionFromUrl();

    if (currentSection !== Section.preview) {
      if (graphQlLoadingError) {
        return <div>{JSON.stringify(graphQlLoadingError)}</div>;
      }

      if (loading) {
        return (
          <Container className="container--loading">
            <Loading />
          </Container>
        );
      }
    }

    const prevSection = toSection(currentSection, "prev");
    const nextSection = toSection(currentSection, "next");
    const sectionIndex = sectionsList.indexOf(currentSection);

    return (
      <Container>
        <Form>
          <FormContextProvider value={this.state}>
            {this.renderCurrEditingSection(values)}
          </FormContextProvider>

          {currentSection === Section.preview && (
            <Preview mode={PreviewMode.preview} resume={values} />
          )}

          <div className="bottom-navs">
            {currentSection !== Section.preview ? (
              <>
                {nextSection !== Section.preview && (
                  <PreviewBtn href={this.urlFromSection(Section.preview)}>
                    <ToolTip>Partial: preview your resume</ToolTip>

                    <PreviewBtnIcon />

                    <span>Preview</span>
                  </PreviewBtn>
                )}

                {sectionIndex > 0 && (
                  <EditBtn href={this.urlFromSection(prevSection)}>
                    <ToolTip>
                      {`Previous resume section ${prevSection.toLowerCase()}`}
                    </ToolTip>

                    <PrevBtnIcon />

                    <span>Previous</span>
                  </EditBtn>
                )}

                {nextSection !== Section.preview && (
                  <NextBtn href={this.urlFromSection(nextSection)}>
                    <ToolTip>
                      {`Next resume section ${nextSection.toLowerCase()}`}
                    </ToolTip>

                    <span>Next</span>

                    <NextBtnIcon />
                  </NextBtn>
                )}

                {nextSection === Section.preview && (
                  <NextBtn href={this.urlFromSection(Section.preview)}>
                    <ToolTip>End: preview your resume</ToolTip>

                    <span>Preview Your resume</span>

                    <NextBtnIcon />
                  </NextBtn>
                )}
              </>
            ) : (
              <EditBtn href={this.urlFromSection(backToSection)}>
                <ToolTip>Show resume editor</ToolTip>

                <PrevBtnIcon />

                <span>Back to Editor</span>
              </EditBtn>
            )}
          </div>
        </Form>
      </Container>
    );
  }

  private renderCurrEditingSection = (values: FormValues) => {
    const label = currentSection
      .split("-")
      .map(s => s[0].toUpperCase() + s.slice(1))
      .join(" ") as Section;

    const { setFieldValue } = this.props;

    if (currentSection === Section.personalInfo) {
      return <PersonalInfo values={values.personalInfo} label={label} />;
    }

    if (currentSection === Section.experiences) {
      return (
        <Experiences
          setFieldValue={setFieldValue}
          values={values.experiences}
          label={label}
        />
      );
    }

    if (currentSection === Section.education) {
      return (
        <Education
          label={label}
          values={values.education}
          setFieldValue={setFieldValue}
        />
      );
    }

    if (currentSection === Section.skills) {
      return (
        <Skills
          label={label}
          values={values.skills}
          setFieldValue={setFieldValue}
        />
      );
    }

    if (currentSection === Section.addSkills) {
      return (
        <Rated
          key={label}
          label={label}
          values={values.additionalSkills}
          setFieldValue={setFieldValue}
          rowItemsLabels={{
            description: "Skill (e.g. Editing skills)",
            level: "Rating description (e.g. Advanced) (optional)"
          }}
          fieldName="additionalSkills"
          icon={<Icon name="won" />}
          dataTestId="additional-skills-section"
          idPrefix="Add. Skill"
        />
      );
    }

    if (currentSection === Section.langs) {
      return (
        <Rated
          key={label}
          label={label}
          values={values.languages}
          rowItemsLabels={{
            description: "Language (e.g. Spanish - Certified)",
            level: "Rating description (e.g. Proficient) (optional)"
          }}
          fieldName="languages"
          icon={<Icon name="won" />}
          dataTestId="languages-section"
          setFieldValue={setFieldValue}
          idPrefix="languages"
        />
      );
    }

    if (currentSection === Section.hobbies) {
      return <Hobbies label={label} values={values.hobbies} />;
    }

    return null;
  };

  private updateResume = async () => {
    if (currentSection === Section.preview) {
      return;
    }

    let values = this.props.values;

    /**
     * if valuesTracker is empty (null or {}), then it means we are probably
     * on a render before getResume from apollo is resolved and we don't
     * want to save the form.
     */
    if (!valuesTracker || lodashIsEmpty(valuesTracker)) {
      valuesTracker = values;
      return;
    }

    const photo = values.personalInfo && (values.personalInfo.photo as string);

    /**
     * If we are not uploading a fresh photo file, tell the server so.
     */
    if (photo && !photo.startsWith("data:")) {
      values = update(values, {
        personalInfo: {
          photo: {
            $set: ALREADY_UPLOADED
          }
        }
      });

      valuesTracker = update(valuesTracker, {
        personalInfo: {
          photo: {
            $set: ALREADY_UPLOADED
          }
        }
      });
    }

    if (lodashIsEqual(values, valuesTracker)) {
      return;
    }

    // tslint:disable-next-line:no-console
    console.log(
      "\n\t\tLogging start\n\n\n\n values\n",
      values,
      "\n\n\n\n\t\tLogging ends\n"
    );

    // tslint:disable-next-line:no-console
    console.log(
      "\n\t\tLogging start\n\n\n\n valuesTracker\n",
      valuesTracker,
      "\n\n\n\n\t\tLogging ends\n"
    );

    const { updateResume } = this.props;

    if (!updateResume) {
      return;
    }

    try {
      const result = await updateResume({
        variables: {
          input: {
            ...(values as UpdateResumeInput)
          }
        }
      });

      if (!result) {
        return;
      }

      const { data } = result;

      if (!data) {
        return;
      }

      const updatedResumeResume = data.updateResume;

      if (!updatedResumeResume) {
        return;
      }

      const { resume } = updatedResumeResume;

      if (!resume) {
        return;
      }

      valuesTracker = getInitialValues(resume);
    } catch (error) {
      logger("error", "update catch error", error);
    }
  };

  private urlFromSection = (section: Section) => {
    const {
      location: { pathname }
    } = this.props;

    return `${pathname}${ResumePathHash.edit}/${section}`;
  };

  private sectionFromUrl = (): Section => {
    const {
      location: { hash }
    } = this.props;

    const section = hash.split("/")[1];

    currentSection = (section
      ? section
      : Section.personalInfo
    ).toLowerCase() as Section;

    backToSection =
      currentSection !== Section.preview ? currentSection : backToSection;

    return currentSection;
  };

  private valueChanged = () => {
    if (debounceUpdateResume) {
      debounceUpdateResume();
    }
  };
}

export default ResumeForm;
