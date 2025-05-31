import { Button } from 'twenty-ui/input';

const eqData = [
  { label: 'Confidence', value: 82, color: 'bg-blue-500' },
  { label: 'Empathy', value: 67, color: 'bg-pink-500' },
  { label: 'Clarity', value: 91, color: 'bg-green-500' },
];

export const EQAnalyzerCard = () => {
  return (
    <div className="w-full p-6 border rounded-xl bg-card shadow-sm flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">EQ Analyzer</h2>
        <p className="text-muted-foreground text-sm mb-4">
          SalesEQ analysis for this call. Scores are AI-generated.
        </p>
        <div className="flex flex-col gap-4">
          {eqData.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="font-medium text-base">{item.label}</span>
                <span className="font-mono text-base">{item.value}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${item.color}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="primary" size="small" title="Summarize Call" />
      </div>
    </div>
  );
}; 