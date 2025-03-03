import { selectTheme } from "@/lib/features/userData/userDataSlice"
import { useAppSelector } from "@/lib/hooks"

export default function Information() {
  const theme = useAppSelector(selectTheme)
  return (
    <div className="flex-col space-y-4">
      <h1 className="text-center font-bold">Objective</h1>
      <p>
        Apply Bubble Sort Algorithm on the given array to sort it using the provided controls.
        <br />
        <em>Please note that:</em>
      </p>
      <ol className="list-decimal ps-5">
        <li>You are not supposed to apply any optimizations over the original bubble sort algorithm.</li>
        <li>Sorting of the array is the secondary objective; The primary objective is the correct application of the bubble sort algorithm.</li>
      </ol>
      <div className="text-center m-1 flex-col justify-center space-y-2">
        <h1 className="font-bold">Variables Description</h1>
        <table className="w-full" id="variables-table">
          <thead>
            <tr>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Variable</th>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Data Type</th>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Valid values</th>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Initialization</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>b</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>int</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>[0,n]</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>n</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>f (Fringe)</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>int</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>b - 1, null</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>b - 1, null</td>
            </tr>
          </tbody>
        </table>
        <p>where n is the length of the array.</p>
      </div>
      <div className="text-center m-1 flex-col justify-center space-y-2">
        <h1 className="font-bold">Controls Description</h1>
        <table className="w-full" id="variables-table">
          <thead>
            <tr>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Control</th>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Bubble</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Bubbles the max element between indexes [0,b) to b - 1</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Decrement Boundary</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Decrements b by 1 if b &gt; 0</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Enter Bubble</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Enter into lower level abstraction of Bubble function</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="m-1 space-y-2">
        <h1 className="text-center font-bold">Procedure</h1>
        <ol className="list-decimal ps-5">
          <li>Click on the suitable control to simulate the buble sort algorithm.</li>
          <li>You can <em>Undo</em> and <em>Redo</em> actions or <em>Reset</em> the experiment by clicking on the respective buttons.</li>
          <li>Click on the <em>Exit Level</em> button when you wish to exit out of current level of abstraction.</li>
        </ol>
      </div>
    </div>
  )
}
