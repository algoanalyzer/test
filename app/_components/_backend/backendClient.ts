/**
 * Backend Client v1.1
 * Handler to store experiment data in the database.
 * Database service: Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { nanoid } from '@reduxjs/toolkit'

// Supabase client for interacting with the database
const supabase = createClient(
  'https://bntbtwmekqapfgsnskxh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJudGJ0d21la3FhcGZnc25za3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNDkzNDAsImV4cCI6MjAzMDcyNTM0MH0.-iQ42X0OUrjBjlVKS3LjWGevUShS5NAVfF4AqrAjw0Q'
)

// Possible error codes.
const StatusCodes = Object.freeze({
  OK: '0',
  NonExistentUser: '1',
  NonExistentRun: '2'
})

let userID: string = ""
let runID: string = ""

/**
 * Function to create user record based on their roll number.
 * @param rollNumber Roll Number of the user.
 * @returns userID string of length 10.
 */
async function createUser(rollNumber: number | string) {
  let userID: string

  // Query if the rollNumber already exists.
  const queryUserID = await supabase
    .from('userTable')
    .select('user_id,roll_number')
    .eq('roll_number', rollNumber.toString())

  if (queryUserID.error) { console.log('createUser', queryUserID.error) }

  // Store existing userID if it exists.
  if (queryUserID.data !== null && queryUserID.data.length > 0) {
    userID = queryUserID.data[0].user_id
  }
  // Create new userID.
  else {
    // console.log('count', queryUserID.count)
    // Generate unique userID.
    userID = nanoid(10)
    // Store userID in the database.
    const response = await supabase
      .from('userTable')
      .insert([{
        user_id: userID,
        roll_number: rollNumber,
        created_at: new Date().toISOString()
      }])
      .select()

    console.log('userID inserted:', response)
  }

  // Return userID.
  return userID
}

/**
 * Function to create run record based on the userID.
 * @param userID ID of the user.
 * @param experimentID ID of the experiment.
 * @param initialState Initial state of the experiment.
 * @returns runID string of length 15 if userID exists.
 */
async function createRun(
  userID: string,
  experimentID: string,
  initialState: any
) {
  // Query if the userID exists.
  const query = await supabase
    .from('userTable')
    .select('user_id')
    .eq('user_id', userID)

  if (query.error) { console.log('createRun', query.error) }

  // Store runID if userID exists.
  if (query.data !== null && query.data.length > 0) {
    // Generate unique runID.
    const runID = nanoid(15)
    // Store generated runID against the userID in runTable.
    const response = await supabase
      .from('runTable')
      .insert([{
        user_id: userID,
        run_id: runID,
        experiment_id: experimentID,
        initial_state: initialState,
        completed: false,
        created_at: new Date().toISOString()
      }])
      .select()

    console.log('runID created:', response.data)

    // Return the runID.
    return runID
  }
  // Return error code for non-existent user.
  else {
    console.log('createRun', query.data, query.status, query.statusText)
    return StatusCodes.NonExistentUser
  }
}

/**
 * Function to mark a run as complete.
 * @param runID ID of the run.
 * @returns Status of updation.
 */
async function completeRun(runID: string) {
  // Query if the runID exists.
  const query = await supabase
    .from('runTable')
    .select('run_id')
    .eq('run_id', runID)

  if (query.error) { console.log('completeRun', query.error) }

  // Mark run as completed if runID exists.
  if (query.data !== null && query.data.length > 0) {
    const response = await supabase
      .from('runTable')
      .update({ completed: true })
      .eq('run_id', runID)
      .select()

    console.log('runID completed:', response.data)

    return StatusCodes.OK
  }
  // Return error code for non-existent run.
  else {
    console.log('completeRun', query.data, query.status, query.statusText)
    return StatusCodes.NonExistentRun
  }
}

/**
 * Function to store a run action.
 * @param runID ID of the run.
 * @param actionName Name of the action.
 * @param actionParameters (optional) Relevant parameters to the action.
 * @param preState (optional) State before the action.
 * @param postState (optional) State after the action.
 * @returns Status of updation.
 */
async function updateRun(
  runID: string,
  actionName: string,
  actionParameters: object,
  preState: object,
  postState: object
) {
  // Query if the runID exists.
  const query = await supabase
    .from('runTable')
    .select('run_id')
    .eq('run_id', runID)

  if (query.error) { console.log('updateRun', query.error) }

  // Update run if runID exists.
  if (query.data !== null && query.data.length > 0) {
    const response = await supabase
      .from('runTransitionTable')
      .insert([{
        run_id: runID,
        action: actionName,
        parameters: actionParameters,
        pre_state: preState,
        post_state: postState,
        timestamp: new Date().toISOString()
      }])
      .select()

    console.log('runID updated:', response.data)

    return StatusCodes.OK
  }
  // Return error code for non-existent run.
  else {
    console.log('updateRun', query)
    return StatusCodes.NonExistentRun
  }
}

/**
 * Handler for storing experiment data in the backend.
 * @param rollNumber User Identifier number or string.
 * @param experimentID Name of experiment.
 * @param initialState Initial state of the exeperiment.
 * @param actionName Name of the action.
 * @param actionType Whether the action is init, submit or an experiment action.
 * @param actionParameters (optional) Relevant parameters to the action.
 * @param preState (optional) State before the action.
 * @param postState (optional) State after the action.
 */
export default async function backendClient(
  rollNumber: number | string,
  experimentID: string,
  initialState: object,
  actionName: string,
  actionType: string,
  actionParameters: object = {},
  preState: object = {},
  postState: object = {}
) {
  let experiment = experimentID.split(' ').join('_')

  // Initialisation.
  if (actionType === 'init' && userID === "") {
    // Create/Read userID.
    userID = await createUser(rollNumber)
    console.log(userID)

    // Create runID.
    runID = await createRun(userID, experiment, initialState)
    console.log(runID)
  }
  // Update the action.
  let response = await updateRun(
    runID,
    actionName,
    actionParameters,
    preState,
    postState
  )
  if (response !== StatusCodes.OK) {
    console.log('updateRun status', response)
  }
  // Completion.
  if (actionType === 'submit') {
    // Update runID to indicate completion.
    await completeRun(runID)
    userID = ""
    runID = ""
  }
}
