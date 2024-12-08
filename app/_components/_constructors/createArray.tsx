import ArrayElement from "@/app/_components/_buttons/arrayElements"

// Function to generate the array.
export default function CreateArray({
  array,
  selected,
  sorted,
  descending,
  hideIndex,
  currentIndex,
  currentBoundary,
  currentMax,
  currentMin,
}: {
  array: number[],
  selected?: number,
  sorted?: boolean | number,
  descending?: boolean,
  hideIndex?: boolean,
  currentIndex?: number,
  currentBoundary?: number,
  currentMax?: number,
  currentMin?: number,
}) {
  function checkBoundarySorted(array: number[], boundary: number, descending?: boolean) {
    let index = boundary
    while ((index + 1) < array.length) {
      if (descending && (array[index] < array[index + 1])) { return false }
      else if (array[index] > array[index + 1]) { return false }

      index += 1
    }
    return true
  }

  return (
    <div className="flex w-full justify-evenly items-start text-lg lg:text-2xl">
      {/* Value Names */}
      <div className="flex flex-col justify-start items-center space-y-1 lg:space-y-2">
        <span className="p-2.5 lg:p-3.5 text-sky-600">array:</span>
        <span className="text-amber-600" hidden={hideIndex}>position:</span>
      </div>
      {/* Array Elements */}
      {array.map((value, index) => {
        return (<div className="flex flex-col justify-start items-center space-y-1 lg:space-y-2" key={index}>
          {/* Element */}
          <ArrayElement
            value={value}
            index={index}
            highlight={index === selected}
            sorted={
              (typeof sorted === "number")
                ? ((index >= sorted) && checkBoundarySorted(array, sorted, descending))
                : sorted
            }
          />
          {/* Position/Index */}
          <span className="text-amber-600" hidden={hideIndex}>
            {index}
          </span>
          {/* Index Pointer */}
          <span className="text-amber-600" hidden={currentIndex === index ? false : true}>
            i
          </span>
          {/* Boundary Pointer */}
          <span className="text-purple-600" hidden={currentBoundary === index ? false : true}>
            b
          </span>
          {/* Fringe Pointer */}
          <span className="text-purple-600" hidden={(currentBoundary && ((currentBoundary - 1) === index)) ? false : true}>
            f
          </span>
          {/* Max Pointer */}
          <span className="text-purple-600" hidden={currentMax === index ? false : true}>
            max
          </span>
          {/* Min Pointer */}
          <span className="text-purple-600" hidden={currentMin === index ? false : true}>
            min
          </span>
        </div>)
      })}
      {/* Boundary Element */}
      {(hideIndex !== true) && <div className="flex flex-col justify-start items-center space-y-1 lg:space-y-2">
        <div className="flex justify-center mt-8 lg:mt-9 p-2 lg:p-3 rounded-lg">{`${' '}`}</div>
        <span className="text-amber-600" hidden={hideIndex}>{array.length}</span>
        <span className="text-amber-600" hidden={currentIndex === array.length ? false : true}>i</span>
        <span className="text-purple-600" hidden={currentBoundary === array.length ? false : true}>b</span>
      </div>}
    </div>
  )
}
