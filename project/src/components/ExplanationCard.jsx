import { Sparkles, Loader2 } from "lucide-react";

const ExplanationCard = ({
  explanation,
  loading,
  onGenerate,
  hasData,
  isHazard
}) => {

  return (

    <div className={`p-6 rounded-lg shadow-md border-2 ${
      isHazard
        ? "bg-red-100 border-red-500"
        : "bg-blue-50 border-blue-200"
    }`}>

      <div className="flex items-center gap-2 mb-4">

        <Sparkles className="w-5 h-5" />

        <h3 className="text-xl font-bold">

          AI Insight

        </h3>

      </div>



      {/* explanation */}

      {explanation && (

        <div className="bg-white p-4 rounded mb-4 text-gray-800">

          {explanation}

        </div>

      )}



      {/* no data */}

      {!hasData && (

        <div className="text-gray-500 mb-4">

          No data available

        </div>

      )}



      {/* button */}

      <button

        onClick={() => {

          if (!loading && hasData) {

            onGenerate();

          }

        }}

        disabled={loading || !hasData || isHazard}

        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2"

      >

        {loading ? (

          <>

            <Loader2 className="w-4 h-4 animate-spin" />

            Generating...

          </>

        ) : (

          <>

            <Sparkles className="w-4 h-4" />

            Generate Explanation

          </>

        )}

      </button>


    </div>

  );

};

export default ExplanationCard;