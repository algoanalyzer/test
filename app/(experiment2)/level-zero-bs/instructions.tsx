import { selectTheme } from "@/lib/features/userData/userDataSlice"
import { useAppSelector } from "@/lib/hooks"

export default function Information() {
  const theme = useAppSelector(selectTheme)
  return (
    <div className="flex-col space-y-4">
      <h1 className="text-center font-bold">Objective</h1>
      <p>
        Apply Bubble Sort Algorithm on the given array to sort it using the provided controls.
      </p>
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
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Apply Bubble Sort</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Applies the Bubble Sort algorithm on the array</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Enter Bubble Sort</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Enter into lower level abstraction of the Bubble Sort algorithm</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="m-1 space-y-2">
        <h1 className="text-center font-bold">Procedure</h1>
        <ol className="list-decimal ps-5">
          <li>Click on the suitable control to simulate the bubble sort algorithm.</li>
          <li>You can <em>Undo</em> and <em>Redo</em> actions or <em>Reset</em> the experiment by clicking on the respective buttons.</li>
          <li>Click on the <em>Submit Run</em> button when you are done.</li>
        </ol>
      </div>
    </div>
  )
}
