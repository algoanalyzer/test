"use client" // Client-side Component to allow for state changes.

export default function TreeElement({
  value,
  index,
  id,
  handler,
  highlight
}: {
  value: any
  index: number | string
  id?: string
  handler?: Function
  highlight?: boolean
}) {
  return (
    <span
      className={"flex justify-center p-3 border-2 border-purple-600 rounded-full text-black text-2xl "
        + (highlight ? "border-dashed bg-yellow-300" : "border-solid bg-purple-300")}
      key={index}
      onClick={handler ? () => handler() : handler}
      id={id}
    >
      {value}
    </span>
  )
}
