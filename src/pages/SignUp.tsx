import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';
import { AxiosError } from 'axios';

interface SignupData {
  email: string;
  password: string;
  confirmationPassword: string;
  nickname: string;
}

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    confirmationPassword: '',
    nickname: '',
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    for (const key in signupData) {
      if (!signupData[key as keyof SignupData].trim()) {
        setErrorMsg(`${key} is empty!`);
        return;
      }
    }
    const { confirmationPassword, ...data } = signupData;
    if (signupData.password !== confirmationPassword) {
      setErrorMsg('Check the confirmation password.');
      return;
    }

    try {
      setErrorMsg('');
      setLoading(true);
      await signup(data);
      navigate('/login');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorCode = error.response.data.code;
        if (errorCode === 40901) {
          setErrorMsg('This email address has already been registered.');
        } else if (errorCode === 40902) {
          setErrorMsg('This nickname is already in use.');
        }
      } else {
        setErrorMsg('Sign-up failed due to an unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='w-full mt-4 flex flex-col items-center text-lg'>
      <div className='w-80 max-w-100'>
        <div className='my-4 text-center text-2xl font-bold text-brand'>
          Sign Up
        </div>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col items-start gap-5'
        >
          <FormInput
            type='email'
            id='email'
            name='email'
            value={signupData.email}
            label='Enter your email'
            onChange={handleInputChange}
          />
          <FormInput
            type='password'
            id='password'
            name='password'
            value={signupData.password}
            label='Create a password'
            onChange={handleInputChange}
          />
          <FormInput
            type='password'
            id='confirmation-password'
            name='confirmationPassword'
            value={signupData.confirmationPassword}
            label='Confirm the password'
            onChange={handleInputChange}
            error={
              signupData.password === signupData.confirmationPassword
                ? ''
                : 'Check the password'
            }
          />
          <FormInput
            type='text'
            id='nickname'
            name='nickname'
            value={signupData.nickname}
            label='Make your own nickname'
            onChange={handleInputChange}
          />
          <Button
            label='Join'
            disabled={loading}
            onClick={handleSubmit}
            size='full'
            shape='primary'
            type='submit'
          />
        </form>
        {errorMsg && <p className='text-red text-sm font-medium'>{errorMsg}</p>}
      </div>
    </section>
  );
};

export default Signup;
