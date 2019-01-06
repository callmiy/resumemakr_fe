import Home from "./home-x";
import { OwnProps } from "./home";
import { currentResumeTitleLocalMutationGql } from "../State/current-resume-title.local.mutation";

export default currentResumeTitleLocalMutationGql<OwnProps>()(Home);
