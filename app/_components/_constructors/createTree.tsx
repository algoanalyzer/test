"use client" // Client-side Component to allow for state changes.

import TreeElement from '@/app/_components/_buttons/treeElements';
import { useEffect } from 'react';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';

interface TreeNodeData {
  name: string,
  attributes?: Record<string, string | number | boolean>,
  children?: TreeNodeData[]
}

interface ParentChildPair {
  parent: string,
  child: string
}

/**
 * Function to create a JSON tree from an array containing the heap elements.
 * @param array Array of heap elements.
 * @param i Index of array element.
 * @returns JSON tree containing the heap.
 */
function createTreeData(array: number[], i: number) {
  let heapTree = {} as TreeNodeData
  // If specified array index exceeds array length.
  if (i >= array.length)
    return heapTree
  // Add the array element.
  else
    heapTree.name = array[i].toString()

  // If left child exists.
  if ((2 * i) + 1 < array.length) {
    // If array containing children data is not initialised.
    if (heapTree.children === undefined) {
      heapTree.children = []
    }
    // Add left child.
    heapTree.children.push(createTreeData(array, 2 * i + 1))
  }

  // If right child exists.
  if ((2 * i) + 2 < array.length) {
    // If array containing children data is not initialised.
    if (heapTree.children === undefined) {
      heapTree.children = []
    }
    // Add right child.
    heapTree.children.push(createTreeData(array, 2 * i + 2))
  }

  return heapTree
}

/**
 * Function to generate the elements of a tree.
 * @param treeData JSON object containing the data of the tree nodes.
 * @param index Index of the current node.
 * @param selected Index that is selected.
 * @param count Number of tree elements.
 * @returns HTML div containing the tree nodes.
 */
function createTreeElements(treeData: TreeNodeData, index: number, selected: number | null, count: number) {
  // Create Tree Elements.
  return (
    <div className='flex flex-col justify-center items-center space-y-10' id={`parent-${index}-${count}`} >
      {/* Parent Node */}
      <TreeElement value={treeData.name} index={index} id={`node-${index}-${count}`} highlight={index === selected} />
      {/* Child Nodes Container */}
      {treeData.children !== undefined &&
        (<div className='flex flex-row justify-between items-center space-x-20' id={`children-${index}-${count}`} >
          {treeData.children.map((value, i) => {
            // Child Node
            return (createTreeElements(value, 2 * index + i + 1, selected, count))
          })}
        </div>)}
    </div>
  )
}

/**
 * Function to generate the branches of a tree.
 * @param pairsArray Array containing a tuple of index of parent and index of child.
 * @param nodeCount Number of nodes.
 * @returns HTML div element containing all the branches connecting the nodes.
 */
function createTreeBranches(pairsArray: ParentChildPair[], nodeCount: number) {
  let count: number = 0
  return (
    <div>
      {pairsArray.map((value) => {
        return (
          <Xarrow
            start={`node-${value.parent}-${nodeCount}`}
            startAnchor='bottom'
            end={`node-${value.child}-${nodeCount}`}
            endAnchor='top'
            strokeWidth={2}
            showHead={false}
            showTail={false}
            curveness={0.5}
            key={`branch-${count++}`}
          />)
      })}
    </div>
  )
}

// Function to generate the tree.
export default function CreateTree({ array, selected }: { array: number[], selected?: number }) {
  // Render whenever any change occurs.
  const updateXarrow = useXarrow()
  useEffect(() => { updateXarrow }, [updateXarrow])

  // JSON object containing hierarchial data of the tree.
  const treeData = createTreeData(array, 0)

  // Array containing the parent-child index touples.
  let treeJointList: ParentChildPair[] = []
  for (let i = 0; i < array.length; i++) {
    const left = 2 * i + 1, right = 2 * i + 2
    if (left < array.length) { treeJointList.push({ parent: i.toString(), child: left.toString() }) }
    if (right < array.length) { treeJointList.push({ parent: i.toString(), child: right.toString() }) }
  }

  // HTML div containing all the tree elements.
  let Elements = createTreeElements(treeData, 0, selected !== undefined ? selected : null, array.length)
  // HTML div containing all the tree branches.
  let Branches = createTreeBranches(treeJointList, array.length)

  return (
    <Xwrapper>
      {Elements}
      <div onLoad={updateXarrow}>
        {Branches}
      </div>
    </Xwrapper>
  )
}

export { createTreeData }
export type { TreeNodeData }
