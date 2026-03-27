function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl flex
      [background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.cyan.500)_86%,_theme(colors.cyan.300)_90%,_theme(colors.cyan.500)_94%,_theme(colors.slate.600/.48))_border-box]
      border border-transparent animate-border">
      
      <div className="w-full h-full overflow-hidden rounded-2xl">
        {children}
      </div>
    </div>
  );
}
export default BorderAnimatedContainer;