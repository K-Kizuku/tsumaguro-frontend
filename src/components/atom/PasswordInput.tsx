'use client';
import {
  Box,
  Progress,
  PasswordInput,
  Group,
  Text,
  Center
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ChangeEvent } from 'react';

function PasswordRequirement({
  meets,
  label
}: //   handler
{
  meets: boolean;
  label: string;
  //   handler: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Text color={meets ? 'teal' : 'red'} mt={5} size='sm'>
      <Center inline>
        {meets ? (
          <IconCheck size='0.9rem' stroke={1.5} />
        ) : (
          <IconX size='0.9rem' stroke={1.5} />
        )}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: '数字を入れてね' },
  { re: /[a-z]/, label: '小文字を入れてね' },
  { re: /[A-Z]/, label: '大文字も入れて欲しいな' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: '変な文字も入れて欲しいなぁ' }
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export default function PasswordStrength({
  handler
}: {
  handler: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [value, setValue] = useInputState('');
  const strength = getStrength(value);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
      //   handler={handler}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: '0ms' } }}
        value={
          value.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
      />
    ));

  return (
    <div>
      <PasswordInput
        // value={value}
        onChange={(e) => {
          setValue(e);
          handler(e);
        }}
        placeholder='Your password'
        label='パスワード'
        required
      />

      <Group spacing={5} grow mt='xs' mb='md'>
        {bars}
      </Group>

      <PasswordRequirement
        label='6文字以上でよろしく'
        meets={value.length > 5}
      />
      {checks}
    </div>
  );
}
