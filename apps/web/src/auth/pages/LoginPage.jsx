import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore, useForm } from '../../hooks';
import './LoginPage.css';

// Regex expressions for form validation
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{5,}$/;

const loginFormFields = {
  loginEmail: '',
  loginPassword: '',
};

const loginFormValidations = {
  loginEmail: [(email) => emailRegex.test(email), 'Email is not valid'],
  loginPassword: [
    (pass) => passwordRegex.test(pass),
    '5+ characters long, at least one letter and one number',
  ],
};

const registerFormFields = {
  registerName: '',
  registerEmail: '',
  registerPassword: '',
  registerPassword2: '',
};

const registerFormValidations = {
  registerName: [(name) => name.length > 2, 'Name length must be greater than 2 characters'],
  registerEmail: [(email) => emailRegex.test(email), 'Email is not valid'],
  registerPassword: [
    (pass) => passwordRegex.test(pass),
    '5+ characters long, at least one letter and one number',
  ],
};

export const LoginPage = () => {
  const { startLogin, startRegister, errorMessage } = useAuthStore();

  // Forms
  const {
    loginEmail,
    loginPassword,
    loginEmailValid,
    loginPasswordValid,
    isFormValid: isLoginFormValid,
    onInputChange: onLoginInputChange,
  } = useForm(loginFormFields, loginFormValidations);

  const {
    registerName,
    registerEmail,
    registerPassword,
    registerPassword2,
    registerNameValid,
    registerEmailValid,
    registerPasswordValid,
    isFormValid: isRegisterFormValid,
    onInputChange: onRegisterInputChange,
  } = useForm(registerFormFields, registerFormValidations);

  // state controllers
  const [isLoginFormSubmitted, setIsLoginFormSubmitted] = useState(false);
  const [isRegisterFormSubmitted, setisRegisterFormSubmitted] = useState(false);

  const onLoginSubmit = (event) => {
    event.preventDefault();
    setIsLoginFormSubmitted(true);

    if (!isLoginFormValid) return;

    startLogin({ email: loginEmail, password: loginPassword });
  };

  const onRegisterSubmit = (event) => {
    event.preventDefault();
    setisRegisterFormSubmitted(true);

    if (!isRegisterFormValid) return;

    if (registerPassword !== registerPassword2) {
      Swal.fire('Register error', 'Passwords do not match', 'error');
      return;
    }

    startRegister({ name: registerName, email: registerEmail, password: registerPassword });
  };

  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire({
        title: 'Auth error',
        html: errorMessage,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
      });
    }
  }, [errorMessage]);

  return (
    // Login form
    <div className='container login-container'>
      <div className='row justify-content-around'>
        <div className='col-md-5 login-form-1'>
          <h3>Login</h3>
          <form onSubmit={onLoginSubmit}>
            <div className='form-group mb-2'>
              <input
                type='text'
                className='form-control'
                placeholder='Email'
                name='loginEmail'
                value={loginEmail}
                onChange={onLoginInputChange}
              />
              <p style={{ color: 'red' }}>{isLoginFormSubmitted ? loginEmailValid : ''}</p>
            </div>
            <div className='form-group mb-2'>
              <input
                type='password'
                className='form-control'
                placeholder='Password'
                name='loginPassword'
                value={loginPassword}
                onChange={onLoginInputChange}
              />
              <p style={{ color: 'red' }}>{isLoginFormSubmitted ? loginPasswordValid : ''}</p>
            </div>
            <div className='form-group mb-2 mt-4'>
              <input type='submit' className='btnSubmit' value='Login' />
            </div>
          </form>
        </div>

        {/* Register form */}
        <div className='col-md-5 login-form-2'>
          <h3>Register</h3>
          <form onSubmit={onRegisterSubmit}>
            <div className='form-group mb-2'>
              <input
                type='text'
                className='form-control'
                placeholder='Name'
                name='registerName'
                value={registerName}
                onChange={onRegisterInputChange}
              />
              <p style={{ color: '#ccc' }}>{isRegisterFormSubmitted ? registerNameValid : ''}</p>
            </div>

            <div className='form-group mb-2'>
              <input
                type='email'
                className='form-control'
                placeholder='Email'
                name='registerEmail'
                value={registerEmail}
                onChange={onRegisterInputChange}
              />
              <p style={{ color: '#ccc' }}>{isRegisterFormSubmitted ? registerEmailValid : ''}</p>
            </div>

            <div className='form-group mb-2'>
              <input
                type='password'
                className='form-control'
                placeholder='Password'
                name='registerPassword'
                value={registerPassword}
                onChange={onRegisterInputChange}
              />
              <p style={{ color: '#ccc' }}>
                {isRegisterFormSubmitted ? registerPasswordValid : ''}
              </p>
            </div>

            <div className='form-group mb-2'>
              <input
                type='password'
                className='form-control'
                placeholder='Repeat the password'
                name='registerPassword2'
                value={registerPassword2}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className='form-group mb-2 mt-4'>
              <input type='submit' className='btnSubmit' value='Create account' />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
