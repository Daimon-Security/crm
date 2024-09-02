import { ErrorMessage } from "formik";

const CustomErrorMessage = ({ name}: any) => (

    <ErrorMessage name={name}>
      {(errorMessage) => <div style={{ color: 'red' }}>{errorMessage}</div>}
    </ErrorMessage>
  );

  export default CustomErrorMessage;