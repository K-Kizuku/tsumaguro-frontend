'use client';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Popover,
  LoadingOverlay,
  Box
} from '@mantine/core';
import { ChangeEvent, useState } from 'react';
import PasswordStrength from '~/components/atom/PasswordInput';
import axios from 'axios';
import { useDisclosure } from '@mantine/hooks';
import useLocalStorage from '~/hooks/useLocalstrage';
import { useRouter } from 'next/navigation';

export default function AuthenticationTitle() {
  const [userInput, setUserInput] = useState<{
    email: string;
    password: string;
  }>({ email: '', password: '' });
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [value, setter] = useLocalStorage('jwt', '');
  const [userId, setUserId] = useLocalStorage('user_id', '');
  const [visible, { toggle }] = useDisclosure(false);
  const router = useRouter();

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput((ele) => {
      return { ...ele, password: e.target.value };
    });
  };
  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput((ele) => {
      return { ...ele, email: e.target.value };
    });
  };

  const signin = () => {
    const post = async () => {
      const temp = await axios
        .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login', {
          username: userInput.email,
          password: userInput.password
        })
        .then((res) => {
          setter(res.data.access_token);
          router.push('/list');
        });
    };
    try {
      post();
    } catch (err) {
      console.error(err);
    }
  };
  const signup = () => {
    // setInterval(() => {
    //   console.log('ただいま実行中');
    // }, 10000);

    toggle();
    const post = async () => {
      const temp = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/users',
        {
          email: userInput.email,
          password: userInput.password
        },
        {
          headers: { SecFetchDest: 'no-cors' }
        }
      );
      setUserId(temp.data.id);
      const sign = await axios
        .post(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login', {
          username: userInput.email,
          password: userInput.password
        })
        .then((res) => {
          setter(res.data.access_token);
          router.push('/list');
        });
    };
    try {
      post();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      {/* ...other content */}
      <Container size={420} my={40}>
        <Title
          align='center'
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900
          })}
        >
          Hello!! OUR SEA10!!
        </Title>
        {isSignIn ? (
          <Text color='dimmed' size='sm' align='center' mt={5}>
            まだユーザー登録が済んでない？{' '}
            <Anchor
              size='sm'
              component='button'
              onClick={() => setIsSignIn(false)}
            >
              サインアップ
            </Anchor>
          </Text>
        ) : (
          <Text color='dimmed' size='sm' align='center' mt={5}>
            もう登録済みだよね？{' '}
            <Anchor
              size='sm'
              component='button'
              onClick={() => setIsSignIn(true)}
            >
              サインイン
            </Anchor>
          </Text>
        )}

        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <Box maw={400} pos='relative'>
            <LoadingOverlay visible={visible} overlayBlur={2} />
            <TextInput
              label='Eメール'
              placeholder='hackz@hackathon.dev'
              required
              onChange={emailHandler}
            />
            <PasswordStrength handler={passwordHandler} />
            {isSignIn ? (
              <Group position='apart' mt='lg'>
                {/* <Checkbox label='Remember me' /> */}
                <Popover width={200} position='bottom' withArrow shadow='md'>
                  <Popover.Target>
                    <Anchor component='button' size='sm'>
                      パスワード忘れちゃった
                    </Anchor>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Text size='md'>頑張って思い出してね</Text>
                  </Popover.Dropdown>
                </Popover>
                <Button
                  fullWidth
                  mt='xl'
                  onClick={(e) => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('name', userInput.email);
                    }
                    toggle();
                    signin();
                  }}
                >
                  サインイン
                </Button>
              </Group>
            ) : (
              <Button
                fullWidth
                mt='xl'
                onClick={(e) => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('name', userInput.email);
                  }
                  toggle();
                  signup();
                }}
              >
                サインアップ
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}
