import React from "react";
import { Form } from "semantic-ui-react";
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
  lastSectionIndex,
  Props,
  getInitialValues
} from "./resume-form";

import {
  PreviewBtn,
  PreviewBtnIcon,
  EditBtn,
  PrevBtnIcon,
  BottomNavs,
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
import AdditionalSkills from "../AdditionalSkills";
import Languages from "../Languages";
import Hobbies from "../Hobbies";
import Skills from "../Skills";
import Loading from "../Loading";
import { ALREADY_UPLOADED } from "../constants";
import { UpdateResumeInput } from "../graphql/apollo-gql";
import { ResumePathHash } from "../routing";
import logger from "../logger";

let valuesTracker: FormValues | null = null;
let debounceUpdateResume: (ResumeForm["updateResume"] & Cancelable) | undefined;
let currentSection: Section = Section.personalInfo;
let backToSection: Section = Section.personalInfo;

export class ResumeForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    debounceUpdateResume = lodashDebounce<ResumeForm["updateResume"]>(
      this.updateResume,
      500
    );
  }

  componentDidMount() {
    valuesTracker = this.props.values;
  }

  componentWillUnmount() {
    if (debounceUpdateResume) {
      debounceUpdateResume.cancel();
    }

    valuesTracker = null;
    currentSection = (null as unknown) as Section;
    backToSection = (null as unknown) as Section;
  }

  componentDidUpdate() {
    if (debounceUpdateResume) {
      debounceUpdateResume();
    }
  }

  render() {
    const { loading, error: graphQlLoadingError, values } = this.props;

    if (graphQlLoadingError) {
      return <div>{JSON.stringify(graphQlLoadingError)}</div>;
    }

    if (loading) {
      return (
        <Container>
          <Loading />
        </Container>
      );
    }

    currentSection = this.sectionFromUrl();
    const prevSection = toSection(currentSection, "prev");
    const nextSection = toSection(currentSection, "next");
    const sectionIndex = sectionsList.indexOf(currentSection);

    return (
      <Container>
        <Form>
          {this.renderCurrEditingSection(values)}

          {currentSection === Section.preview && (
            <Preview mode={PreviewMode.preview} />
          )}

          <BottomNavs>
            {currentSection !== Section.preview ? (
              <>
                {sectionIndex !== lastSectionIndex && (
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

                {sectionIndex < lastSectionIndex && (
                  <NextBtn href={this.urlFromSection(nextSection)}>
                    <ToolTip>
                      {`Next resume section ${nextSection.toLowerCase()}`}
                    </ToolTip>

                    <span>Next</span>

                    <NextBtnIcon />
                  </NextBtn>
                )}

                {sectionIndex === lastSectionIndex && (
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
          </BottomNavs>
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
          updatePageUrl={this.updatePageUrl}
          makePageUrl={this.makePageUrl}
        />
      );
    }

    if (currentSection === Section.education) {
      return <Education label={label} values={values.education} />;
    }

    if (currentSection === Section.addSkills) {
      return (
        <AdditionalSkills
          label={label}
          values={values.additionalSkills || []}
        />
      );
    }

    if (currentSection === Section.langs) {
      return <Languages label={label} values={values.languages} />;
    }

    if (currentSection === Section.hobbies) {
      return <Hobbies label={label} values={values.hobbies} />;
    }

    if (currentSection === Section.skills) {
      return <Skills label={label} values={values.skills} />;
    }

    return null;
  };

  private updateResume = async () => {
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

    const isStringPhoto =
      "string" === typeof (values.personalInfo && values.personalInfo.photo);

    /**
     * If we are not uploading a fresh photo file, tell the server so.
     */
    if (isStringPhoto) {
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

  private updatePageUrl = (url: string) => {
    this.props.history.push(url);
  };

  private makePageUrl = (url: string) => {
    return this.urlFromSection(currentSection) + "/" + url;
  };
}

export default ResumeForm;
