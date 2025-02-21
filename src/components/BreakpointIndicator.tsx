export default function BreakpointIndicator() {
  return (
    process.env.NODE_ENV === 'development' && (
      <div className="fixed left-0 top-0 z-[100000] flex w-[30px] items-center justify-center bg-slate-200 py-[2.5px] text-[12px] uppercase text-black sm:bg-red-200 md:bg-yellow-200 lg:bg-green-200 xl:bg-blue-200 2xl:bg-pink-200">
        <span className="block xs:hidden">all</span>
        <span className="hidden xs:block sm:hidden">xs</span>
        <span className="hidden sm:block md:hidden">sm</span>
        <span className="hidden md:block lg:hidden">md</span>
        <span className="hidden lg:block xl:hidden">lg</span>
        <span className="hidden xl:block 2xl:hidden">xl</span>
        <span className="hidden 2xl:block">2xl</span>
      </div>
  ))
}