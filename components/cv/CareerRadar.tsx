'use client';

import React, { useState } from 'react';
import { Loader2, Lightbulb, TrendingUp } from 'lucide-react';

interface CareerRadarProps {
  jobTitle: string;
}

interface RadarData {
  growthPercentage: string;
  growthText: string;
  topSkills: string[];
  advice: string;
}

export function CareerRadar({ jobTitle }: CareerRadarProps) {
  const [data, setData] = useState<RadarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError('Si è verificato un errore durante l\'analisi. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Career Radar
          </h3>
          <p className="text-sm text-gray-600">Scopri i trend di mercato per: <span className="font-medium">{jobTitle}</span></p>
        </div>
        {!data && !loading && (
          <button
            onClick={fetchInsights}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Analizza Mercato per questo ruolo
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-sm text-gray-500">Analisi del mercato in corso...</p>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <span className="text-2xl font-bold text-green-600">{data.growthPercentage}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Crescita del settore</p>
              <p className="text-sm text-gray-600">{data.growthText}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Competenze più richieste</p>
            <div className="flex flex-wrap gap-2">
              {data.topSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white border border-blue-100 text-blue-700 text-xs font-medium rounded-full shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-yellow-100 shadow-sm flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">{data.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
