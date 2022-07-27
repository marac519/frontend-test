import type { NextPage } from 'next'
import Router from "next/router";
// import React from 'react'

import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import useAppStore from "../store/useStore"
import GoogleButton from 'react-google-button';

function Login(props:any) {

    const setuser = useAppStore((state:any) => state.setuser)
    
    const [type, toggle] = useToggle(['login', 'register']);
    const form = useForm({
      initialValues: {
        email: '',
        name: '',
        password: '',
        terms: true,
      },

      // validate: {
      //   email: (val) => /^\S+@\S+$/.test(val) && 'Invalid email',
      //   password: (val) => val.length >= 6 && 'Password should include at least 6 characters',
      //   terms: (val:any) => val == true,
      // },
    });
    
    function signInWithGoogle_to_firebase(){
        
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then(async (result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
            //console.log("user: ",user)
            await setuser(user)
            Router.push("/");
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    function signInWithEmailAndPassword_to_firebase(){
      const auth = getAuth();
      const email = form.values.email
      const password = form.values.password

      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in 
          const user = userCredential.user;
          await setuser(user)
          Router.push("/");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });

    }

    function signUpWithEmailAndPassword_to_firebase(){
      const auth = getAuth();
      const email = form.values.email
      const password = form.values.password

      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in 
          const user = userCredential.user;
          await setuser(user)
          Router.push("/");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }


  return (
    <div className='background-container'>
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to Mantine, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton className='googlebutton' onClick={() => signInWithGoogle_to_firebase()} >Google</GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button
            onClick={type == 'register' ? signUpWithEmailAndPassword_to_firebase : signInWithEmailAndPassword_to_firebase}
            type="submit">{upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
    </div>
    )
}

export default Login