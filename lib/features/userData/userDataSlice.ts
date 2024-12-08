import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

type ThemeStates = "Light" | "Dark"

// Selection Sort Level State Interface.
export type LevelStateData = {
  level: number,
  stateTimeline: SelectionSortState[],
  currentStateIndex: number,
}

// Selection Sort State Interface.
export type SelectionSortState = {
  array: number[],
  i: number,
  max?: number,
  b: number,
  lowerlevel: LevelStateData,
}

// Define a type for the slice state
export interface UserDataState {
  rollNumber: string,
  theme: ThemeStates,
  levelState: LevelStateData,
}

const arrayLength = 6

/**
 * Function to create a random array without duplicates.
 * @returns Array containing arrayLength numbers.
 */
function createRandomArray() {
  let array: number[] = []
  let count = arrayLength

  while (count > 0) {
    const number = Math.round(Math.random() * 10)
    let noDuplicates = true

    // Checking for duplicates.
    for (let index = 0; index < array.length && noDuplicates; index++) {
      if (array[index] === number)
        noDuplicates = false
    }

    // If no duplicates are present.
    if (noDuplicates) {
      array.push(number)
      count -= 1
    }
  }

  return array
}

/**
 * Function that creates an instance of a Selection Sort State.
 * @param array Array of numbers.
 * @param i Current index.
 * @param max Index of max value.
 * @param b Boundary index.
 * @returns SelectionSortState instance.
 */
export function createState(array: number[], i: number, max: number | undefined, b: number): SelectionSortState {
  let state: SelectionSortState = {} as SelectionSortState

  state.array = array.slice()
  state.b = b
  state.i = i
  state.max = max
  state.lowerlevel = {} as LevelStateData

  return state
}

const initialArray = createRandomArray()
const initialSelectionSortState = createState(initialArray, 0, undefined, arrayLength)

function initLevelState(level: number, initialState: SelectionSortState): LevelStateData {
  let levelState: LevelStateData = {} as LevelStateData

  levelState.level = level
  levelState.stateTimeline = [{...initialState}]
  levelState.currentStateIndex = 0

  return levelState
}

const initialLevelStateData = initLevelState(0, initialSelectionSortState)

// Define the initial state using that type
const initialState: UserDataState = {
  rollNumber: "",
  theme: "Light",
  levelState: initialLevelStateData,
}

export const userDataSlice = createSlice({
  name: 'userData',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    // Update the rollNumber
    updateRollNumber: (state, action: PayloadAction<string>) => {
      state.rollNumber = action.payload
      console.log("Roll Number:", state.rollNumber)
    },
    // Update the theme
    updateTheme: (state, action: PayloadAction<ThemeStates>) => {
      state.theme = action.payload
    },
    // Store State of Level
    storeLevelState: (state, action: PayloadAction<LevelStateData>) => {
      console.log("newLevelStateData:", action.payload)

      let newState = {...state}.levelState
      let level = action.payload.level

      while (level > 1) {
        newState = newState.stateTimeline[newState.currentStateIndex].lowerlevel
        level -= 1
      }

      // For Level 0
      if (action.payload.level === 0)
        state.levelState = action.payload
      // For other levels
      else
        newState.stateTimeline[newState.currentStateIndex].lowerlevel = action.payload
    }
  }
})

export const { updateRollNumber, updateTheme, storeLevelState } = userDataSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectRollNumber = (state: RootState) => state.userData.rollNumber
export const selectTheme = (state: RootState) => state.userData.theme
export const selectLevelState = (state: RootState) => state.userData.levelState
export const selectInitialArray = () => initialArray
export const selectArrayLength = () => arrayLength

export default userDataSlice.reducer
