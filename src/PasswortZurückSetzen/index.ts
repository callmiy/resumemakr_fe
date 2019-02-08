import { graphql, compose } from "react-apollo";
import { withFormik } from "formik";

import { PasswortZurückSetzen } from "./passwort-zurück-setzen-x";
import { EigenesMerkmale, formikConfig } from "./passwort-zurück-setzen";
import {
  PASSWORT_ZURÜCK_SETZEN_VERANDERUNG,
  PasswortZuruckSetzenVeranderungMerkmale
} from "../graphql/passwort_zurück_setzen.veränderung";
import {
  PasswortZuruckSetzenVeranderung,
  PasswortZuruckSetzenVeranderungVariables,
  AktualisierenAbfrage,
  AktualisierenAbfrageVariables,
  AnfordernPasswortZuruckSetzen,
  AnfordernPasswortZuruckSetzenVariables
} from "../graphql/apollo-gql";
import {
  AKTUALISIEREN_ABFRAGE,
  AktualisierenAbfrageMerkmale
} from "../graphql/aktualisieren.abfrage";
import { ZURUCK_SETZEN_PFAD_ANFORDERN } from "../routing";
import {
  ANFORDERN_PASSWORT_ZURUCK_SETZEN,
  AnfordernPasswortZuruckSetzenMerkmale
} from "../graphql/anfordern-passwort-zuruck-setzen.veranderung";

const passwortZuruckSetzenGql = graphql<
  EigenesMerkmale,
  PasswortZuruckSetzenVeranderung,
  PasswortZuruckSetzenVeranderungVariables,
  PasswortZuruckSetzenVeranderungMerkmale | undefined
>(PASSWORT_ZURÜCK_SETZEN_VERANDERUNG, {
  props: ({ mutate }) => {
    return (
      mutate && {
        passwortZuruckSetzenVeranderung: mutate
      }
    );
  }
});

const aktualisierenGql = graphql<
  EigenesMerkmale,
  AktualisierenAbfrage,
  AktualisierenAbfrageVariables,
  AktualisierenAbfrageMerkmale | undefined
>(AKTUALISIEREN_ABFRAGE, {
  props: ({ data }) => data,

  skip: ({ match }) => match.params.token === ZURUCK_SETZEN_PFAD_ANFORDERN,

  options: ({ match }) => ({
    variables: {
      jwt: match.params.token
    }
  })
});

const anfordernPasswortZuruckSetzenGql = graphql<
  EigenesMerkmale,
  AnfordernPasswortZuruckSetzen,
  AnfordernPasswortZuruckSetzenVariables,
  AnfordernPasswortZuruckSetzenMerkmale | undefined
>(ANFORDERN_PASSWORT_ZURUCK_SETZEN, {
  props: ({ mutate }) =>
    mutate && {
      anfordernPasswortZuruckSetzen: mutate
    }
});

export default compose(
  anfordernPasswortZuruckSetzenGql,
  passwortZuruckSetzenGql,
  aktualisierenGql,
  withFormik(formikConfig)
)(PasswortZurückSetzen);
