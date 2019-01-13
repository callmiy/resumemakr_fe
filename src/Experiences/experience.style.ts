import styled from "styled-components/macro";
import { Card } from "semantic-ui-react";

import { withControls } from "../styles/mixins";

export const ExperienceContainer = styled(Card)`
  .with-controls {
    ${withControls}
  }

  .achievement-header {
    padding-bottom: 5px;
  }
`;

export const ExperienceHeader = styled(Card.Content)`
  ${withControls}

  &:after {
    display: none !important;
  }
`;
