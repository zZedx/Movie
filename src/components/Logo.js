export function Logo({isMobile}) {
  return (
    <div className="logo">
      <span role="img">🎬</span>
      {!isMobile && <h1>MovieHub</h1>}
    </div>
  );
}
