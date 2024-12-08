"use client" // Client-side Component to allow for state changes.

export default function ArrayElement({
  value,
  index,
  id,
  handler,
  highlight,
  sorted,
}: {
  value: any
  index: number | string
  id?: string
  handler?: Function
  highlight?: boolean
  sorted?: boolean
}) {
  return (
    <span
      className={"flex justify-center p-2 lg:p-3 border-2 border-sky-600 text-black text-xl lg:text-2xl rounded-lg "
        + (highlight
          ? "border-dashed bg-yellow-300"
          : sorted
            ? "border-solid bg-green-300"
            : "border-solid bg-slate-300")}
      key={index}
      onClick={handler ? () => handler() : handler}
      id={id}
    >
      {value}
    </span>
  )
}
