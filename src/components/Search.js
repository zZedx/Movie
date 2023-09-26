import { useEffect, useRef } from "react";

export function Search({ query, setQuery }) {
  const inputEl = useRef(null)
  useEffect(()=>{
    function callback(e){
      if(document.activeElement === inputEl.current) return
      if(e.code === 'Enter'){
        inputEl.current.focus()
        setQuery('')
    }}
    inputEl.current.focus()
    document.addEventListener('keydown' , callback)
    return ()=>document.removeEventListener('keydown' , callback)
  },[setQuery])
  
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
