function Sprite({sidebarVisible}: {sidebarVisible: boolean}) {
    return(
        <div
        className={`
          content flex flex-1 items-center justify-center 
          transition-all duration-500 ease-in-out
          ${sidebarVisible ? 'relative' : 'absolute inset-0 no-dots'}
        `}
      >
        <img 
          src="/vite.svg" 
          className={`
            select-none transition-all duration-500 ease-in-out
            ${sidebarVisible ? 'w-1/2 h-1/2' : 'w-3/5 h-3/5'}
          `}
        />
      </div>
    )
}

export default Sprite;