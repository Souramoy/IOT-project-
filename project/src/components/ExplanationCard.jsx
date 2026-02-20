import { Sparkles, Loader2 } from 'lucide-react';

const ExplanationCard = ({ explanation, loading, onGenerate, hasData }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg shadow-md border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Explainable AI Insights</h3>
      </div>

      {!hasData && (
        <p className="text-gray-600 mb-4">
          No sensor data available. Please add sensor readings from the admin dashboard first.
        </p>
      )}

      {hasData && !explanation && !loading && (
        <p className="text-gray-600 mb-4">
          Click the button below to generate an AI-powered explanation of the current sensor readings.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-blue-600 mb-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Generating explanation...</span>
        </div>
      )}

      {explanation && !loading && (
        <div className="bg-white p-5 rounded-lg border border-blue-200 mb-4">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{explanation}</p>
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={loading || !hasData}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Explanation
          </>
        )}
      </button>
    </div>
  );
};

export default ExplanationCard;
