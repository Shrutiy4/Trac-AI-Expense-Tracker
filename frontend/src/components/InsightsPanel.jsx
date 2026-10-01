const InsightsPanel = ({ suggestions, compact = false }) => {
  // fallback if suggestions is a string (from loading or error state)
  const tips = Array.isArray(suggestions)
    ? suggestions
    : suggestions?.split('\n').filter(tip => tip.trim() !== '');

  return (
    <div className="text-md text-base-content/80 space-y-2">
      {tips.slice(0, compact ? 2 : tips.length).map((tip, i) => (
        <p key={i}>{tip}</p>
      ))}
      {/* {!compact && tips.length > 0 && (
        <>
          <hr />
          <p className="font-semibold">Tip: Prepare meals in advance to reduce impulse spends.</p>
        </>
      )} */}
    </div>
  );
};

export default InsightsPanel;
