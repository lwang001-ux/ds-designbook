'use client';

interface AIDisclaimerProps {
  className?: string;
}

export function AIDisclaimer({ className = '' }: AIDisclaimerProps) {
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-amber-800 mb-1">
            Discussion Only Forum
          </h4>
          <p className="text-sm text-amber-700">
            This forum is for discussing AI in education. It is <strong>NOT</strong> for
            generating or requesting AI-created lesson plans, assessments, unit plans,
            or curriculum content. Requests for AI-generated content will be removed.
          </p>
          <p className="text-sm text-amber-600 mt-2">
            Please share your experiences, ask questions, and discuss best practices for
            using AI tools in your classroom instead.
          </p>
        </div>
      </div>
    </div>
  );
}
