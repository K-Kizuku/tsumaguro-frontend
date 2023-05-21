'use client';
import { Text, Paper } from '@mantine/core';

function Chatbox({ message }: { message: string }) {
  // const t = '#' + Math.floor(Math.random() * 16777215).toString(16);
  return (
    <Paper shadow='xs' radius='lg' p='md' withBorder>
      <Text>{message}</Text>
    </Paper>
  );
}

export default Chatbox;
