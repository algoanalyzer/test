"use client" // Client-side Component to allow for state changes and routing.

import Layout from "@/app/layout"
import Instructions from "./instructions"
import ActionButton from "@/app/_components/_buttons/actionButton"
import CreateArray from "@/app/_components/_constructors/createArray"
import ThemeToggle from "@/app/_components/_buttons/darkModeToggleButton"
import { Suspense, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import {
  selectTheme,
  SelectionSortState,
  selectLevelState,
  storeLevelState,
  LevelStateData,
  selectRollNumber
} from "@/lib/features/userData/userDataSlice"
import Loading from "./loading"
import backendClient from "@/app/_components/_backend/backendClient"

const levelNumber = 1
const experimentName = "BubbleSortHierarchicalDT"

// List of Actions
const Action = Object.freeze({
  Init: 'InitLevelOne',
  Undo: 'Undo',
  Redo: 'Redo',
  Reset: 'Reset',
  Exit: 'ExitLevelOne',
  Bubble: 'Bubble',
  DiveIntoLevelTwo: 'DiveIntoLevelTwo',
  DecrementBResetI: 'DecrementBResetI',
})

// List of Prompts
const Prompts = Object.freeze({
  Init: "Level One.",
  Undo: "Undo successful.",
  Redo: "Redo successful.",
  Reset: "Experiment reset to initial state.",
  Exit: "Exiting to higher level.",
  Bubble: "Bubbled max unsorted element.",
  DiveIntoLevelTwo: "Entering lower level of Bubble.",
  DiveIntoSwapMax: "Entering lower level of Swap Boundary and Max Elements.",
  DecrementBResetI: "Decremented 'b' and reset 'i' to 0."
})

/**
 * Function to create an instance of the level state.
 * @param level Level number.
 * @param status Boolean of whether the level is active or not.
 * @param timeline Action timeline.
 * @param stateIndex Index of timeline element indicating the current experiment state.
 * @returns 
 */
function createLevelState(level: number, timeline: SelectionSortState[], stateIndex: number): LevelStateData {
  let levelState: LevelStateData = {} as LevelStateData

  levelState.level = level
  levelState.stateTimeline = timeline
  levelState.currentStateIndex = stateIndex

  return levelState
}

/**
 * Function that creates an instance of a Selection Sort State.
 * @param array Array of numbers.
 * @param i Current index.
 * @param max Index of max value.
 * @param b Boundary index.
 * @returns SelectionSortState instance.
 */
function createState(array: number[], i: number, b: number): SelectionSortState {
  let state: SelectionSortState = {} as SelectionSortState

  state.array = array
  state.b = b
  state.i = i
  state.lowerlevel = {} as LevelStateData

  return state
}

// const state: SelectionSortState = {
//   array: [1234, 567, 89, 0],
//   i: 0,
//   max: 0,
//   b: 4
// }

// const prompt = "Experiment Initialised."

/**
 * Function to initialise the Action timeline.
 * @param levelState LevelStateData from redux store.
 * @returns Timeline of Action history.
 */
function initLevelState(levelState: LevelStateData) {
  let state = { ...levelState }
  let level = levelNumber

  while (level > 0) {
    // If lower LevelStateData doesn't exist
    if (Object.keys(state.stateTimeline[state.currentStateIndex].lowerlevel).length === 0) {
      // Create lower level SelectionSortState data
      const newState = createState(
        state.stateTimeline[state.currentStateIndex].array,
        state.stateTimeline[state.currentStateIndex].i,
        state.stateTimeline[state.currentStateIndex].b
      )

      // Create and store lower LevelStateData
      state = createLevelState(
        levelState.level - state.level + 1,
        [newState],
        0
      )

      // Return the state.
      return state
    }
    // If lower LevelStateData exists
    else {
      // Update state to the lower state
      state = state.stateTimeline[state.currentStateIndex].lowerlevel
    }

    // Decrement level counter
    level -= 1
  }

  // If there was a modification of SelectionSortState in the lower level, 
  // remove all actions after current state index
  // and add the new state as the latest action.
  if (Object.keys(state.stateTimeline[state.currentStateIndex].lowerlevel).length !== 0) {
    const currentState = state.stateTimeline[state.currentStateIndex]
    const lowerLevelState = state.stateTimeline[state.currentStateIndex].lowerlevel
    let newState = { ...lowerLevelState.stateTimeline[lowerLevelState.currentStateIndex] }

    // Check if lower state and current state values match. 
    // If not, update the current timeline with the new state entry.
    if ((currentState.b !== newState.b) || (currentState.i !== newState.i)) {
      // New timeline.
      let newTimeline = state.stateTimeline.slice(0, state.currentStateIndex + 1)
      newTimeline.push(createState(
        newState.array,
        newState.i,
        newState.b))

      // New level state.
      state = createLevelState(state.level, newTimeline, newTimeline.length - 1)
    }
  }
  console.log("level:", levelNumber, "initLevelState:", state)

  return state
}

export default function Experiment() {
  // Router for navigation between pages.
  const router = useRouter()
  // Store Reducer dispatcher.
  const dispatch = useAppDispatch()
  // Initialisation.
  const rollNumber = useAppSelector(selectRollNumber)
  const theme = useAppSelector(selectTheme)
  const initialLevelState = initLevelState(useAppSelector(selectLevelState))
  const [levelState, setLevelState] = useState<LevelStateData>(initialLevelState)
  const [preState, setPreState] = useState<SelectionSortState>({} as SelectionSortState)
  const [state, setState] = useState<SelectionSortState>(initialLevelState.stateTimeline[initialLevelState.currentStateIndex])
  const [type, setType] = useState<string>(Action.Init)
  const [prompt, setPrompt] = useState<string>(Prompts.Init)
  const [completed, setCompleted] = useState<boolean>(false)

  // Handlers.
  function handleBubble() {
    // New variables.
    let newArray = state.array.slice()
    for (let index = 0; index < state.b - 1; index++) {
      if (newArray[index] > newArray[index + 1]) {
        let temp = newArray[index]
        newArray[index] = newArray[index + 1]
        newArray[index + 1] = temp
      }
    }
    const newState = createState(newArray, state.b - 1, state.b)
    let newTimeline = levelState.stateTimeline.slice(0, levelState.currentStateIndex + 1)
    newTimeline.push(newState)
    // Update states.
    setPreState({ ...state })
    setLevelState(createLevelState(levelNumber, newTimeline, levelState.currentStateIndex + 1))
    setState(newState)
    setType(Action.Bubble)
    setPrompt(Prompts.Bubble)
  }

  function handleDecrementBResetI() {
    // New variables.
    const newState = createState(state.array, 0, state.b - 1)
    let newTimeline = levelState.stateTimeline.slice(0, levelState.currentStateIndex + 1)
    newTimeline.push(newState)
    // Update states.
    setPreState({ ...state })
    setLevelState(createLevelState(levelNumber, newTimeline, levelState.currentStateIndex + 1))
    setState(newState)
    setType(Action.DecrementBResetI)
    setPrompt(Prompts.DecrementBResetI)
  }

  function handleDiveIntoLevelTwo() {
    // Logs.
    console.log("status when diving into one:", levelState)
    // Store level data.
    dispatch(storeLevelState(levelState))
    // Update states.
    setPreState({ ...state })
    setState(state)
    setType(Action.DiveIntoLevelTwo)
    setPrompt(Prompts.DiveIntoLevelTwo)
  }

  function handleUndo() {
    // Update states.
    setPreState({ ...state })
    setState(levelState.stateTimeline[levelState.currentStateIndex - 1])
    setLevelState(createLevelState(levelNumber, levelState.stateTimeline, levelState.currentStateIndex - 1))
    setType(Action.Undo)
    setPrompt(Prompts.Undo)
  }

  function handleRedo() {
    // Update states.
    setPreState({ ...state })
    setState(levelState.stateTimeline[levelState.currentStateIndex + 1])
    setLevelState(createLevelState(levelNumber, levelState.stateTimeline, levelState.currentStateIndex + 1))
    setType(Action.Redo)
    setPrompt(Prompts.Redo)
  }

  function handleReset() {
    // New variables.
    let initState = initialLevelState.stateTimeline[0]
    let newTimeline = [createState(initState.array, initState.i, initState.b)]
    let newLevelState = createLevelState(levelNumber, newTimeline, 0)
    // Update states.
    setPreState({ ...state })
    setLevelState(newLevelState)
    setState(newLevelState.stateTimeline[0])
    setType(Action.Reset)
    setPrompt(Prompts.Reset)
  }

  function handleDone() {
    // New variables.
    const newLevelState = createLevelState(levelNumber, levelState.stateTimeline, levelState.currentStateIndex)
    // Update states.
    setPreState({ ...state })
    setLevelState(newLevelState)
    setState({ ...state })
    setType(Action.Exit)
    setPrompt(Prompts.Exit)
    setCompleted(true)
  }

  function checkSorted() {
    let sorted: boolean = true
    for (let index = 1; index < state.array.length; index++) {
      if (state.array[index] < state.array[index - 1]) {
        sorted = false
        break
      }
    }
    return sorted
  }

  // Log actions.
  useEffect(() => {
    console.log("status:", levelState)
    console.log("L1 rollNumber:", rollNumber)
    backendClient(rollNumber, experimentName, initialLevelState.stateTimeline[0], type, 'experiment')
    // Redirect to lower level upon clicking Dive In Find Max.
    if (type === Action.DiveIntoLevelTwo) {
      router.replace("/level-two-bs")
    }
    // Redirect upon completion.
    if (completed) {
      dispatch(storeLevelState(levelState))
      router.replace("/level-zero-bs")
    }
  }, [router, type, preState, state, completed])

  return (
    <Layout >
      {/* Header */}
      <header
        id='headerBlock'
        className={'grid p-4 grid-cols-4 justify-around bg-gradient-to-r from-blue-600 from-25% to-sky-600 shadow-lg'}
      >
        <span className={"flex px-4 font-sans text-xl md:text-2xl font-bold text-slate-50 col-span-2 lg:col-span-3 justify-self-start items-center"}>
        Algo Analyzer - Bubble Sort - Level One
        </span>
        <div className='col-span-2 lg:col-span-1 flex justify-end lg:justify-around items-center'>
          <ThemeToggle />
        </div>
      </header>
      {/* Experiment */}
      <Suspense fallback={<Loading />}>
        <div className="flex-grow flex overflow-hidden">
          {/* Information */}
          <div className="max-w-min lg:max-w-2xl overflow-y-auto shadow-md p-4 lg:p-8 text-md lg:text-xl">
            <Instructions />
          </div>
          {/* Activity */}
          <div className="w-full text-md lg:text-2xl overflow-auto">
            <div className="flex relative min-h-full w-full">
              {/* Controls */}
              <div className={"flex flex-col min-h-0 min-w-0 flex-grow justify-evenly items-center overflow-auto"}>
                {/* Prompt */}
                <div className="w-full">
                  <div className={
                    "text-center m-4 p-1 lg:p-2 rounded-md border-2 text-black lg:text-xl "
                    + ((prompt === Prompts.Bubble)
                      ? "bg-green-300 border-green-400"
                      : "bg-blue-300 border-blue-400")}
                  >
                    {prompt}
                  </div>
                </div>
                {/* Variables */}
                <div className="grid grid-cols-1 grid-rows-1 w-full items-center justify-center h-1/2">
                  <div className="flex w-full h-full justify-start items-center overflow-visible">
                    <div className="flex flex-col justify-center items-center text-center w-1/6 h-full lg:p-1 text-md lg:text-2xl">
                      {/* i = {state.i}
                      <br />
                      max = {state.max}
                      <br /> */}
                      b = {state.b}
                    </div>
                    <CreateArray
                      array={state.array}
                      selected={state.i !== 0 ? state.i : undefined}
                      sorted={(state.b <= 1 && checkSorted()) ? true : state.b}
                      currentBoundary={state.b}
                    />
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex flex-col items-center space-y-2 p-2">
                  <div className="flex justify-between">
                    <ActionButton
                      id="bubble"
                      type="primary"
                      handler={() => handleBubble()}
                    >
                      Bubble
                    </ActionButton>
                    <ActionButton
                      id="dec-boundary"
                      type="primary"
                      disabled={state.b <= 0}
                      handler={() => handleDecrementBResetI()}
                    >
                      Decrement Boundary
                    </ActionButton>
                  </div>
                  <div className="flex justify-between">
                    <ActionButton
                      id="dive-level-two"
                      type="subset"
                      handler={() => handleDiveIntoLevelTwo()}
                    >
                      Enter Bubble
                    </ActionButton>
                    <ActionButton
                      id="exit-level-one"
                      type="subset"
                      handler={() => handleDone()}
                    >
                      Exit Level
                    </ActionButton>
                  </div>
                  <div className="flex justify-between">
                    <ActionButton
                      id="undo"
                      type="secondary"
                      disabled={levelState.currentStateIndex <= 0}
                      handler={() => handleUndo()}
                    >
                      Undo
                    </ActionButton>
                    <ActionButton
                      id="redo"
                      type="secondary"
                      disabled={levelState.currentStateIndex >= (levelState.stateTimeline.length - 1)}
                      handler={() => handleRedo()}
                    >
                      Redo
                    </ActionButton>
                    <ActionButton
                      id="reset"
                      type="secondary"
                      handler={() => handleReset()}
                    >
                      Reset
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </Layout>
  )
}
 