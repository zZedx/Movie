import { useState } from "react";

export function Box({ children , isMobile}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      {!isMobile && <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>}
      {isOpen && children}
    </div>
  );
}
