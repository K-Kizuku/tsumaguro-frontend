'use client';
import { List, ThemeIcon } from '@mantine/core';
import { IconCircleCheck, IconCircleDashed } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { ListInfo } from '~/types/list';
import { Container } from '@mantine/core';
import { streaminglistdummyData } from '~/data/demo';
import Link from 'next/link';
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  createStyles,
  rem,
  useMantineTheme
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: rem(120),
    paddingBottom: rem(80),

    [theme.fn.smallerThan('sm')]: {
      paddingTop: rem(80),
      paddingBottom: rem(60)
    }
  },

  inner: {
    position: 'relative',
    zIndex: 1
  },

  dots: {
    position: 'absolute',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  dotsLeft: {
    left: 0,
    top: 0
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      textAlign: 'left'
    }
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
  },

  description: {
    textAlign: 'center',

    [theme.fn.smallerThan('xs')]: {
      textAlign: 'left',
      fontSize: theme.fontSizes.md
    }
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column'
    }
  },

  control: {
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md
    },

    [theme.fn.smallerThan('xs')]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,

      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0
      }
    }
  }
}));

export const StreamingList = () => {
  const [listData, setListData] = useState<ListInfo[]>(streaminglistdummyData);
  const baseurl = process.env.BACKEND_URL ?? '';
  const theme = useMantineTheme();

  const fetchListData = async () => {
    try {
      const data = await axios.get(baseurl + '/list');
      setListData(streaminglistdummyData);
      // setListData(data.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchListData();
  }, []);
  // const dice = () => {
  //   const d = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  //   return d[Math.floor(Math.random() * 5)];
  // };
  const dice2 = () => {
    const color = Object.keys(theme.colors);
    return color[Math.floor(Math.random() * 9)][Math.floor(Math.random() * 9)];
  };
  return (
    <Container size='lg'>
      <Text size='xl'>配信一覧</Text>
      <List
        spacing='xs'
        size='sm'
        center
        // icon={
        //   <Avatar size={60} color='blue'>
        //     <Text size='lg'>{dice()}</Text>
        //   </Avatar>
        // }
      >
        {listData.map((e) => {
          return (
            <Link href={`/stream?url=${e.url}`} key={e.id}>
              <List.Item className='mx-5'>
                <UnstyledButton>
                  <Group>
                    <Avatar size={60} color={dice2()}>
                      {/* <Text size='lg'>{dice()}</Text> */}
                    </Avatar>
                    <div>
                      <Text size='lg'>{e.title}</Text>
                      <Text size='md' color='dimmed'>
                        {e.misc}
                      </Text>
                    </div>
                  </Group>
                </UnstyledButton>
                {/* {e.owner_name}
                {e.misc} */}
              </List.Item>
            </Link>
          );
        })}
        {/* <List.Item>Clone or download repository from GitHub</List.Item>
        <List.Item>Install dependencies with yarn</List.Item>
        <List.Item>To start development server run npm start command</List.Item>
        <List.Item>
          Run tests to make sure your changes do not break the build
        </List.Item>
        <List.Item
          icon={
            <ThemeIcon color='blue' size={24} radius='xl'>
              <IconCircleDashed size='1rem' />
            </ThemeIcon>
          }
        >
          Submit a pull request once you are done
        </List.Item> */}
      </List>
    </Container>
  );
};
