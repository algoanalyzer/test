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
  setRollNumber: Function
) => {
  e.currentTarget.disabled = true;

  if (backend) {
    let input: string | null = "";
    while (input === "" || input === null) {
      input = prompt("Please enter your roll number.");
      if (input !== null) {
        setRollNumber(input);
        localStorage.setItem("rollNumber", input);
        console.log("Navigating to: /level-zero");
        router.replace("/level-zero"); // Hardcoded route
      } else {
        alert("Please enter your roll number to proceed further!");
      }
    }
  } else {
    setRollNumber("testRollNumber");
    console.log("Navigating to: /level-zero");
    router.push("/level-zero");

  }
};



/**
 * Function to generate an Agree button.
 * @param route Page to redirect to.
 * @returns Button which carries out the Agree function.
 */

function SSButton({ route, start }: { route: string; start?: boolean }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 m-1 rounded text-lg"
      onClick={() => router.replace(route)}
    >
      {start ? "Start" : "Selection Sort"}
    </button>
  );
}




export default SSButton
