import { compose, withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";

import { Preview } from "./preview-x";

export default compose(
  withApollo,
  withRouter
)(Preview);
