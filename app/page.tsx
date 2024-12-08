import Layout from './layout'
import type { Metadata } from 'next'
import AgreeButton from './_components/_buttons/agreeButton'
import ThemeToggle from './_components/_buttons/darkModeToggleButton';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Algo Analyzer',
  description: 'A Website built to understand algorithms using system dynamics',
}

export default function Home() {
  return (
    <Layout >
      <header
        id='headerBlock'
        className={'grid p-4 grid-cols-4 justify-around bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600  shadow-lg'}
      >
        <div className="flex px-4 font-sans text-2xl font-bold text-slate-50 col-span-3 lg:col-span-2 col-start-1 lg:col-start-2 justify-self-center items-center">
          Algo Analyzer
        </div>
        <div className="flex col-start-4 justify-center items-center">
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-grow justify-center items-start overflow-y-auto">
        <div className="container flex-grow flex flex-col justify-evenly p-12 lg:px-24">
          {/* <h1 className="text-2xl">Consent Form </h1> */}

          {/* <p className="py-3">
            <strong>No data&nbsp;</strong>(personal identifiers, usage data,
            etc.) is collected as part of the tool demonstration.
          </p> */}
          <p className="pb-3">
            Please click on the Agree button below to start the tool.
          </p>
          <AgreeButton route="/level-zero" />
        </div>
      </div>
    </Layout>
  )
}