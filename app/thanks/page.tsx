"use client" // Client-side Component to allow for store changes and routing.

import Layout from '@/app/layout'
import ActionButton from '@/app/_components/_buttons/actionButton'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { selectTheme, updateRollNumber } from '@/lib/features/userData/userDataSlice'
import ThemeToggle from '../_components/_buttons/darkModeToggleButton'

export default function Home() {
  // Router for navigation between pages.
  const router = useRouter()
  const theme = useAppSelector(selectTheme)

  // Functions to update the userId and runId.
  const dispatch = useAppDispatch();
  const handleUpdateRollNumber = (id: string) => {
    dispatch(updateRollNumber(id))
  }

  // Function to reset userId and return to homepage.
  function handleHome() {
    handleUpdateRollNumber("")
    router.replace('/')
  }

  return (
    <Layout >
      <header
        id='headerBlock'
        className={'grid p-4 grid-cols-4 justify-around bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 shadow-lg'}
      >
        <div className={"flex px-4 font-sans text-xl md:text-2xl font-bold text-slate-50 col-span-3 col-start-1 justify-self-start items-center"}>
          Driving Test - Selection Sort Algorithm
        </div>
        <div className='col-span-1 flex justify-end lg:justify-around items-center'>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-grow h-screen justify-center items-center overflow-y-auto">
        <div className={"container flex-grow flex flex-col justify-around p-10 px-24 h-1/4" + (theme === "Light" ? " text-gray-900" : " text-gray-100")}>
          <div className='flex text-3xl justify-center font-semibold'>
            Thank you for your participation.
          </div>
          <div className='flex justify-center items-center'>
            <ActionButton handler={handleHome}>Return to Homepage</ActionButton>
          </div>
        </div>
      </div>
    </Layout>
  )
}
