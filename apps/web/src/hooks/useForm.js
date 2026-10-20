import { useMemo, useState } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [prevInitialForm, setPrevInitialForm] = useState(initialForm);

  // Reset the form when initialForm changes (adjusting state during render, no effect needed)
  if (initialForm !== prevInitialForm) {
    setPrevInitialForm(initialForm);
    setFormState(initialForm);
  }

  // Validation is derived from formState, so compute it instead of storing it
  const formValidation = useMemo(() => {
    const formCheckedValues = {};

    for (const formField of Object.keys(formValidations)) {
      const [fn, errorMessage] = formValidations[formField];

      formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
    }

    return formCheckedValues;
  }, [formState, formValidations]);

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }

    return true;
  }, [formValidation]);

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,

    ...formValidation,
    isFormValid,
  };
};
