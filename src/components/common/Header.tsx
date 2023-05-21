'use client';
import {
  createStyles,
  Header,
  Autocomplete,
  Group,
  Burger,
  rem,
  Avatar,
  Modal,
  useMantineTheme,
  Textarea,
  TextInput,
  Button,
  Title,
  LoadingOverlay
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import { Tabs } from '@mantine/core';
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings
} from '@tabler/icons-react';
import axios from 'axios';
import { Stream } from '~/types/stream';
import useLocalStorage from '~/hooks/useLocalstrage';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md
  },

  inner: {
    height: rem(56),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none'
    }
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none'
    }
  },
  form: {
    backgroundColor: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md
    // boxShadow: theme.shadows.lg
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0]
    }
  },
  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    '&::placeholder': {
      color: theme.colors.gray[5]
    }
  },

  inputLabel: {
    color: theme.black
  },
  control: {
    backgroundColor: theme.colors[theme.primaryColor][6]
  }
}));

interface HeaderSearchProps {
  links: { link: string; label: string }[];
}
// { links }: HeaderSearchProps
export function HeaderSearch() {
  //   const router = useRouter();
  const [openedLogout, { open: logoutOpen, close: logoutClose }] =
    useDisclosure(false);
  const { classes } = useStyles();
  const [visible, { toggle: loadingToggle }] = useDisclosure(false);

  const [userInput, setUserInput] = useState<{ title: string; misc: string }>({
    title: '',
    misc: ''
  });
  //   let name;
  //   let email;
  //   if (typeof window !== 'undefined') {
  //     name = localStorage.getItem('name');
  //     email = localStorage.getItem('email');
  //   }
  const [openedLive, { open: liveOpen, close: liveClose }] =
    useDisclosure(false);
  const [openedProfile, { open: profileOpen, close: profileClose }] =
    useDisclosure(false);
  const [opened, { toggle }] = useDisclosure(false);
  const [value, setter] = useLocalStorage('jwt', '');
  const [valueLiveId, setterLiveId] = useLocalStorage('live_id', '');

  const getliveUrl = () => {
    const getreq = async () => {
      const temp: Stream = await axios.get('http://localhost:3000/api');
      setterLiveId(temp.uniqueness);
      //   const res = await axios.post(
      //     process.env.NEXT_PUBLIC_BACKEND_URL + '/stream',
      //     {
      //       title: userInput?.title,
      //       misc: userInput?.misc,
      //       url: temp.hlsManifest
      //     },
      //     {
      //       headers: {
      //         Authorization: 'Bearer ' + value
      //       }
      //     }
      //   );
      try {
        getreq();
      } catch (err) {
        console.error(err);
      } finally {
        loadingToggle();
      }
    };
  };

  return (
    <Header height={56} className={classes.header} mb={120}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size='sm' />
          {/* <MantineLogo size={28} /> */}
          <div className='containner1'>
            <div className='stage1'>
              <div className='dice1'>
                <div className='item1'>1</div>
                <div className='item1'>2</div>
                <div className='item1'>3</div>
                <div className='item1'>4</div>
                <div className='item1'>5</div>
                <div className='item1'>6</div>
              </div>
            </div>
          </div>
        </Group>

        <Group>
          <Group ml={50} spacing={5} className={classes.links}>
            <Avatar size={40} mx={20} color='blue' variant='gradient' />
            {/* {name ?? email} */}
          </Group>
          <Tabs sx={{ marginTop: '30px' }}>
            <Tabs.List>
              <Tabs.Tab
                value='PROFILE'
                icon={<IconPhoto size='0.8rem' />}
                onClick={profileOpen}
              >
                PROFILE
              </Tabs.Tab>
              <Tabs.Tab
                value='LIVE START'
                icon={<IconMessageCircle size='0.8rem' />}
                onClick={liveOpen}
              >
                LIVE START
              </Tabs.Tab>
              <Tabs.Tab
                value='LOGOUT'
                icon={<IconSettings size='0.8rem' />}
                onClick={logoutOpen}
              >
                LOGOUT
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value='PROFILE' pt='xs'>
              <Modal
                opened={openedProfile}
                onClose={profileClose}
                title={
                  <Title sx={{ textAlign: 'center' }}>プロフィール登録</Title>
                }
                centered
                withCloseButton
              >
                <div className={classes.form}>
                  <TextInput
                    label='ニックネーム'
                    placeholder='サイコロ サイコ'
                    mt='md'
                    classNames={{
                      input: classes.input,
                      label: classes.inputLabel
                    }}
                  />
                  <Textarea
                    label='みんなに一言'
                    placeholder='サイコロ最高！'
                    minRows={4}
                    mt='md'
                    classNames={{
                      input: classes.input,
                      label: classes.inputLabel
                    }}
                  />

                  <Group position='center' mt='md'>
                    <Button
                      className={classes.control}
                      fullWidth
                      onClick={() => {}}
                    >
                      登録!
                    </Button>
                  </Group>
                </div>
              </Modal>
            </Tabs.Panel>

            <Tabs.Panel value='LIVE START' pt='xs'>
              <Modal
                opened={openedLive}
                onClose={liveClose}
                title={<Title sx={{ textAlign: 'center' }}>配信する？</Title>}
                centered
              >
                <LoadingOverlay visible={visible} overlayBlur={2} />
                <div className={classes.form}>
                  <TextInput
                    label='配信タイトル'
                    placeholder='タイトル'
                    onChange={(e) =>
                      setUserInput((ele) => {
                        return { ...ele, title: e.target.value };
                      })
                    }
                  />
                  <Textarea
                    label='みんなに一言'
                    placeholder='是非見てね！'
                    minRows={4}
                    mt='md'
                    classNames={{
                      input: classes.input,
                      label: classes.inputLabel
                    }}
                    onChange={(e) =>
                      setUserInput((ele) => {
                        return { ...ele, misc: e.target.value };
                      })
                    }
                  />

                  <Group position='center' mt='md'>
                    <Button
                      className={classes.control}
                      fullWidth
                      onClick={() => {
                        loadingToggle();
                        getliveUrl();
                      }}
                      color='red'
                    >
                      配信準備開始！
                    </Button>
                  </Group>
                </div>
              </Modal>
            </Tabs.Panel>

            <Tabs.Panel value='LOGOUT' pt='xs'>
              <Modal
                opened={openedLogout}
                onClose={logoutClose}
                title='ログアウト'
                centered
                shadow='xs'
              >
                <Button
                  className={classes.control}
                  fullWidth
                  //   onClick={() => {
                  //     if (typeof window !== undefined) {
                  //       localStorage.removeItem('jwt');
                  //       router.push('/login');
                  //     }
                  //   }}
                  color='black'
                >
                  {' '}
                  ログアウト
                </Button>
              </Modal>
            </Tabs.Panel>
          </Tabs>
          {/* <Autocomplete
            className={classes.search}
            placeholder='Search'
            icon={<IconSearch size='1rem' stroke={1.5} />}
            data={[
              'React',
              'Angular',
              'Vue',
              'Next.js',
              'Riot.js',
              'Svelte',
              'Blitz.js'
            ]}
          /> */}
        </Group>
      </div>
    </Header>
  );
}
