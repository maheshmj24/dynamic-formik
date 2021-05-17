import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  MyTextInput,
  MyCheckbox,
  MySelect,
  MyPhoneInput,
} from "./formElements";
import { isValidPhoneNumber } from "react-phone-number-input";
import formSchemaJSON from "./formSchema";

interface formSchemaElement {
    type: string,
    label: string,
    placeholder: string,
    required: boolean,
    options: Array<string>,
    conditional_required: boolean,
    condition_field: string,
    condition_values: Array<string>
}
const formSchema: any = formSchemaJSON;
const SignupForm = () => {
  //const [formSchema, setFormSchema] = useState(formSchemaJSON);
  const [initialValues, setInitialValues] = useState({});
  const [validationSchema, setValidationSchema] = useState({});
  const [toSuccessPage, SetToSuccessPage] = useState(false);

  const getFormElem = (elemName: string, elemSchema: formSchemaElement) => {
    const props = {
      name: elemName,
      type: elemSchema.type === "phone" ? "text" : elemSchema.type,
      label: elemSchema.label,
      placeholder: elemSchema.placeholder,
      options: elemSchema.options,
    };

    if (elemSchema.type === "text" || elemSchema.type === "email") {
      return <MyTextInput key={elemName} {...props} />;
    }
    if (elemSchema.type === "select") {
      return <MySelect key={elemName} {...props} />;
    }
    if (elemSchema.type === "phone") {
      return <MyPhoneInput key={elemName} {...props} />;
    }
  };

  useEffect(() => {

    function getInitialValues(formSchema: any) {
      const initialValues: any = {};
      const validationSchema: any = {};

      for (var key of Object.keys(formSchema)) {
        initialValues[key] = "";

        if (formSchema[key].type === "text") {
          validationSchema[key] = Yup.string();
        } else if (formSchema[key].type === "email") {
          validationSchema[key] = Yup.string().email("Invalid email address");
        } else if (formSchema[key].type === "select") {
          validationSchema[key] = Yup.string().oneOf(formSchema[key].options);
        } else if (formSchema[key].type === "checkbox") {
          validationSchema[key] = Yup.boolean().oneOf(
            [true],
            "You must accept the terms and conditions."
          );
        } else if (formSchema[key].type === "phone") {
          validationSchema[key] = Yup.string().test(
            "Test",
            "Invalid Mobile Number",
            (value) => {
              if (value) {
                return isValidPhoneNumber(value);
              }
              return false;
            }
          );
        }

        //Required
        if (formSchema[key].required) {
          validationSchema[key] = validationSchema[key].required("Required");
        }

        //Conditional Required
        if (formSchema[key].conditional_required) {
          let conditionValues = formSchema[key].condition_values;
          validationSchema[key] = validationSchema[key].when(
            formSchema[key].condition_field,
            {
              //is: formSchema[key].condition_values,
              is: (val: string) => conditionValues.includes(val),
              then: validationSchema[key].required("Required"),
            }
          );
        }
      }

      setInitialValues({
        ...initialValues,
        acceptedTerms: false,
      });
      setValidationSchema({
        ...validationSchema,
        acceptedTerms: Yup.boolean()
          .required("Required")
          .oneOf([true], "You must accept the terms and conditions."),
      });
    }

    //setFormSchema(formSchema)
    getInitialValues(formSchema);
  }, []);

  if (toSuccessPage){
    return <Redirect to='/success' />
}
  return (
    <>
      <div className="form">
        {Object.keys(initialValues).length > 0 && (
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object(validationSchema)}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                console.log(values);
                setSubmitting(false);
                SetToSuccessPage(true);
              }, 400);
            }}
          >
            <Form>
              {Object.keys(formSchema).map((key) => {
                return getFormElem(key, formSchema[key]);
              })}

              <MyCheckbox name="acceptedTerms" labeltext="I accept the terms and conditions"/>
              <button type="submit">Submit</button>
            </Form>
          </Formik>
        )}
      </div>
    </>
  );
};

export default SignupForm;
