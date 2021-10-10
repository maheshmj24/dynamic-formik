import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";
import {
  MyCheckbox,
  MyPhoneInput,
  MySelect,
  MyTextInput,
} from './formElements';
import formSchemaJSON from './formSchema';

interface IFormSchemaElement {
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options: Array<string>;
  conditional_required: boolean;
  condition_field: string;
  condition_values: Array<string>;
}

// Form Schema extracted from the formSchema.tsx
const formSchema: any = formSchemaJSON;

const SignupForm: React.FC = () => {
  const [initialValues, setInitialValues] = useState({});
  const [validationSchema, setValidationSchema] = useState({});
  const [status, setStatus] = useState('loading');

  const getFormElem = (elemName: string, elemSchema: IFormSchemaElement) => {
    const props = {
      name: elemName,
      type: elemSchema.type === 'phone' ? 'text' : elemSchema.type,
      label: elemSchema.label,
      placeholder: elemSchema.placeholder,
      options: elemSchema.options,
    };

    if (elemSchema.type === 'text' || elemSchema.type === 'email') {
      return <MyTextInput key={elemName} {...props} />;
    }
    if (elemSchema.type === 'select') {
      return <MySelect key={elemName} {...props} />;
    }
    if (elemSchema.type === 'phone') {
      return <MyPhoneInput key={elemName} {...props} />;
    }
  };

  function getInitialValues(formSchema: any) {
    const initialValues: any = {};
    const validationSchema: any = {};

    for (var key of Object.keys(formSchema)) {
      initialValues[key] = '';

      if (formSchema[key].type === 'text') {
        validationSchema[key] = Yup.string();
      } else if (formSchema[key].type === 'email') {
        validationSchema[key] = Yup.string().email('Invalid email address');
      } else if (formSchema[key].type === 'select') {
        validationSchema[key] = Yup.string().oneOf(formSchema[key].options);
      } else if (formSchema[key].type === 'checkbox') {
        validationSchema[key] = Yup.boolean().oneOf(
          [true],
          'You must accept the terms and conditions.'
        );
      } else if (formSchema[key].type === 'phone') {
        validationSchema[key] = Yup.string().test(
          'Test',
          'Invalid Mobile Number',
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
        validationSchema[key] = validationSchema[key].required('Required');
      }

      //Conditional Required
      if (formSchema[key].conditional_required) {
        let conditionValues = formSchema[key].condition_values;
        validationSchema[key] = validationSchema[key].when(
          formSchema[key].condition_field,
          {
            //is: formSchema[key].condition_values,
            is: (val: string) => conditionValues.includes(val),
            then: validationSchema[key].required('Required'),
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
        .required('Required')
        .oneOf([true], 'You must accept the terms and conditions.'),
    });
  }

  useEffect(() => {
    getInitialValues(formSchema);
    setStatus('loaded');
  }, []);

  if (status === 'successfulsubmission') {
    return (
      <div>
        <h1>Successfully registered.</h1>
        <br />
        <h6>You will receive a confirmation email shortly.</h6>
        <h6>
          Further instructions on how to attend the event will be communicated
          closer to the event.
        </h6>
      </div>
    );
  }

  if (status === 'loading' || status === 'submitting') {
    return (
      <div className='loader'>
        <h4>{status[0].toUpperCase() + status.substring(1) + '...'}</h4>
        <Spinner size={SpinnerSize.large} />
      </div>
    );
  }

  return (
    <div className='form'>
      {status && status === 'loaded' && (
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(validationSchema)}
          onSubmit={(values, { setSubmitting }) => {
            setStatus('submitting');
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              console.log(values);
              setSubmitting(true);
              setStatus('successfulsubmission');
            }, 400);
          }}
        >
          <Form>
            {Object.keys(formSchema).map((key) => {
              return getFormElem(key, formSchema[key]);
            })}

            <MyCheckbox
              name='acceptedTerms'
              labeltext='I accept the terms and conditions'
            />
            <button type='submit'>Submit</button>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default SignupForm;
