'use client';
import {
  createStyles,
  Header,
  Autocomplete,
  Group,
  Burger,
  rem,
  Avatar
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';

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
  }
}));

interface HeaderSearchProps {
  links: { link: string; label: string }[];
}
// { links }: HeaderSearchProps
export function HeaderSearch() {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  //   const items = links.map((link) => (
  //     <a
  //       key={link.label}
  //       href={link.link}
  //       className={classes.link}
  //       onClick={(event) => event.preventDefault()}
  //     >
  //       {link.label}
  //     </a>
  //   ));

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
            {name ?? email}
          </Group>

          <Autocomplete
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
          />
        </Group>
      </div>
    </Header>
  );
}
