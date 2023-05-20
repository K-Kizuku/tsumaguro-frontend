// 'use client';
import { HeaderSearch } from '~/components/common/Header';
import './globals.css';
import { Inter } from 'next/font/google';
// import { createGetInitialProps } from '@mantine/next';
// import { MantineProvider } from '@mantine/core';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app'
// };

// const getInitialProps = createGetInitialProps();
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <HeaderSearch />
        {children}
      </body>
    </html>
  );
}
