"use client" // Client-side Component to allow for routing.

import { useRouter } from 'next/navigation'
import { MouseEvent, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { selectRollNumber, updateRollNumber } from '@/lib/features/userData/userDataSlice'

/**
 * Function to create/fetch userID and proceed with getAlgorithm API.
 * @param e (optional) HTML element whose properties can be modified.
 * @param router Next.js router object.
 * @param backend Boolean to indicate usage of backend.
 * @param setRollNumber Function to store userId.
 * @param route Page to redirect to.
 */
const onClickAgree = async (
  e: MouseEvent<HTMLButtonElement>,
  router: ReturnType<typeof useRouter>,
  backend: boolean,
  setRollNumber: Function,
  route: string,
) => {
  // Logging for testing.
  console.log("Clicked Agree Button.")
  // Disable button.
  e.currentTarget.disabled = true
  // Remove hover and blue color from class
  e.currentTarget.classList.remove("hover:bg-blue-600")
  e.currentTarget.classList.remove("bg-blue-500")
  // Add gray color
  e.currentTarget.classList.add("bg-gray-500")

  // Read rollNumber of user if backend storage is enabled.
  if (backend) {
    let input: string | null = ""
    while ((input === "") || (input === null)) {
      // Prompt for user identifier.
      input = prompt("Please enter your roll number.")
      if (input !== null) {
        // Store user identifier in local storage.
        setRollNumber(input)
        localStorage.setItem("rollNumber", input)
        router.replace(route)
      }
      else
        alert("Please enter your roll number to proceed further!")
    }
  }
  // When backend storage is disabled.
  else {
    // Set testRollNumber.
    setRollNumber("testRollNumber")
    router.replace(route)
  }
}

/**
 * Function to generate an Agree button.
 * @param route Page to redirect to.
 * @returns Button which carries out the Agree function.
 */
function AgreeButton({
  route,
  start
}: {
  route: string,
  start?: boolean
}) {
  let backend = true
  // Router for navigation between pages.
  const router = useRouter()
  // Fetching the rollNumber.
  const rollNumber = useAppSelector(selectRollNumber)

  // If there already exists a rollNumber.
  useEffect(() => {
    console.log("rollNumber:", rollNumber)
    if (rollNumber !== "") {
      console.log("Redirecting to experiment.")
      router.replace(route)
    }
  }, [router, rollNumber, route])

  // Function to update the userId.
  const dispatch = useAppDispatch();
  const handleUpdateRollNumber = (id: string) => {
    dispatch(updateRollNumber(id))
  }

  return (
    <button
      type="button"
      id="agree"
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 m-1 rounded text-lg"
      // Read Roll Number and switch to experiment.
      onClick={(e) => onClickAgree(e, router, backend, handleUpdateRollNumber, route)}
    >
      {start? "Start" : "Agree"}
    </button>
  )
}

export default AgreeButton
