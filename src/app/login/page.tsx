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
  Button
} from '@mantine/core';
import { ChangeEvent, useState } from 'react';
import PasswordStrength from '~/components/atom/PasswordInput';

export default function AuthenticationTitle() {
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  return (
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
      <Text color='dimmed' size='sm' align='center' mt={5}>
        まだユーザー登録が済んでない？{' '}
        <Anchor size='sm' component='button'>
          サインアップ
        </Anchor>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <TextInput
          label='Eメール'
          placeholder='hackz@hackathon.dev'
          required
          onChange={emailHandler}
        />
        <PasswordStrength handler={passwordHandler} />

        {/* <PasswordInput
          label='Password'
          placeholder='Your password'
          required
          mt='md'
          onChange={passwordHandler}
        /> */}
        <Group position='apart' mt='lg'>
          {/* <Checkbox label='Remember me' /> */}
          <Anchor component='button' size='sm'>
            パスワード忘れちゃった
          </Anchor>
        </Group>
        <Button fullWidth mt='xl'>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
