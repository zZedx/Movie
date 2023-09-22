import { useState } from "react";

export default function TextExpander({
  children,
  colapsedNumWords = 20,
  expandButtonText = "Show more",
  collapseButtonText = "Show less",
  buttonColor="#ff6622",
  expanded = false,
  className = '',
  buttonInline = true
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const boxStyle = {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: '7px',
        backgroundColor: '#f7f7f7'
  }
  const buttonStyle = {
    color: buttonColor,
    cursor: "pointer"
  };

  const expandedText = children;
  const slicedText = children
    .split(" ")
    .slice(0, colapsedNumWords)
    .join(" ");

  return (
    <div style={className === 'box' ? boxStyle : null} className={className}>
      <p style={{display : `${buttonInline ? 'inline' : ''}` , margin:0}}>
        {isExpanded ? expandedText : `${slicedText}...`}
      </p>
      <span style={buttonStyle} onClick={() => setIsExpanded((e) => !e)}>
        {isExpanded ? collapseButtonText : expandButtonText}
      </span>
    </div>
  );
}
