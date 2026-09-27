'use client';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { CVData } from '@/lib/types';

interface TemplateRendererProps {
  data: CVData;
  isPro?: boolean;
}

const defaultColor = '#2563eb';

export default function TemplateRenderer({ data, isPro = false }: TemplateRendererProps) {
  const cvRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!cvRef.current) return;
    try {
      setIsDownloading(true);
      toast.info('Generating PDF...');
      
      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personalInfo.firstName || 'CV'}_${data.personalInfo.lastName || 'Document'}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderTemplate = () => {
    switch (data.template) {
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex justify-end w-full max-w-[210mm]">
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isDownloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
      
      <div 
        className="relative bg-white shadow-xl overflow-hidden" 
        style={{ width: '210mm', minHeight: '297mm' }}
      >
        <div ref={cvRef} className="w-full h-full bg-white relative">
          {renderTemplate()}
          
          {!isPro && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-50">
              <div 
                className="text-gray-300 opacity-[0.15] font-bold text-6xl whitespace-nowrap select-none"
                style={{ transform: 'rotate(-45deg)' }}
              >
                Made with CV One Shot
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TEMPLATES
// -------------------------------------------------------------

function ModernTemplate({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, languages, summary, accentColor } = data;
  const color = accentColor || defaultColor;

  return (
    <div className="flex min-h-[297mm] h-full">
      {/* Sidebar */}
      <div className="w-[35%] p-8 text-white flex flex-col" style={{ backgroundColor: color }}>
        {personalInfo.photoUrl && (
          <div className="flex justify-center mb-8">
            <img src={personalInfo.photoUrl} alt="Profile" className="w-36 h-36 rounded-full object-cover border-4 border-white/20" crossOrigin="anonymous" />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-1">{personalInfo.firstName}</h1>
        <h1 className="text-3xl font-light mb-2">{personalInfo.lastName}</h1>
        <p className="text-sm font-medium tracking-wide opacity-90 mb-8 uppercase">{personalInfo.jobTitle}</p>
        
        <div className="space-y-3 mb-10 text-sm">
          {personalInfo.email && <div className="flex items-center gap-2"><span className="opacity-80">Email:</span> {personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-2"><span className="opacity-80">Phone:</span> {personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center gap-2"><span className="opacity-80">Location:</span> {personalInfo.location}</div>}
          {personalInfo.website && <div className="flex items-center gap-2"><span className="opacity-80">Web:</span> {personalInfo.website}</div>}
        </div>

        {skills && skills.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest border-b border-white/20 pb-2">Skills</h2>
            <div className="space-y-4 text-sm">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span>{s.name}</span>
                    <span className="opacity-80 text-xs">{s.level}</span>
                  </div>
                  <div className="w-full bg-white/20 h-1 rounded">
                    <div className="bg-white h-1 rounded" style={{ width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '80%' : s.level === 'Intermediate' ? '60%' : '40%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest border-b border-white/20 pb-2">Languages</h2>
            <div className="space-y-2 text-sm">
              {languages.map((l, i) => (
                <div key={i} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="opacity-80">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[65%] p-10 text-gray-800 bg-white">
        {summary && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest" style={{ color }}>Profile</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-gray-600">{summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest" style={{ color }}>Experience</h2>
            <div className="space-y-8">
              {experience.map((exp, i) => (
                <div key={i}>
                  <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                  <div className="text-sm font-semibold mb-2" style={{ color }}>
                    {exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 uppercase tracking-widest" style={{ color }}>Education</h2>
            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-bold text-lg text-gray-900">{edu.degree}</h3>
                  <div className="text-sm font-semibold mb-1" style={{ color }}>
                    {edu.school}
                  </div>
                  <div className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ClassicTemplate({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, languages, summary, accentColor } = data;
  const color = accentColor || '#000000';

  return (
    <div className="min-h-[297mm] p-12 bg-white text-gray-900 font-serif">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-2" style={{ color }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-xl italic text-gray-600 mb-4">{personalInfo.jobTitle}</p>
          <div className="text-sm space-y-1 text-gray-700">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>
        {personalInfo.photoUrl && (
          <img src={personalInfo.photoUrl} alt="Profile" className="w-28 h-36 object-cover border border-gray-300 shadow-sm" crossOrigin="anonymous" />
        )}
      </div>

      {summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-3 pb-1" style={{ color }}>Professional Summary</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line">{summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1" style={{ color }}>Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <span className="text-sm font-semibold text-gray-600 italic">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-md font-semibold text-gray-800 mb-2">{exp.company}</div>
                <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1" style={{ color }}>Education</h2>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <span className="text-sm text-gray-600 italic">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-sm text-gray-800">{edu.school}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-3 pb-1" style={{ color }}>Skills</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {skills.map((s, i) => (
                <li key={i}>
                  <span className="font-semibold">{s.name}</span> - {s.level}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {languages && languages.length > 0 && (
          <div>
            <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-3 pb-1" style={{ color }}>Languages</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {languages.map((l, i) => (
                <li key={i}>
                  <span className="font-semibold">{l.name}</span> - {l.proficiency}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalTemplate({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, languages, summary, accentColor } = data;
  const color = accentColor || '#111827';

  return (
    <div className="min-h-[297mm] p-14 bg-white text-gray-800 font-sans">
      <div className="flex items-center gap-6 mb-12">
        {personalInfo.photoUrl && (
          <img src={personalInfo.photoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover grayscale" crossOrigin="anonymous" />
        )}
        <div>
          <h1 className="text-4xl font-light tracking-tight mb-1" style={{ color }}>
            {personalInfo.firstName} <span className="font-semibold">{personalInfo.lastName}</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm">{personalInfo.jobTitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 mb-12">
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.website && <span>{personalInfo.website}</span>}
      </div>

      {summary && (
        <div className="mb-12">
          <p className="text-sm leading-loose text-gray-600">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          {skills && skills.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Skills</h2>
              <div className="space-y-3">
                {skills.map((s, i) => (
                  <div key={i} className="text-sm font-medium">{s.name}</div>
                ))}
              </div>
            </div>
          )}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Languages</h2>
              <div className="space-y-3">
                {languages.map((l, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{l.name}</span>
                    <span className="block text-xs text-gray-400">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-9">
          {experience && experience.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Experience</h2>
              <div className="space-y-8">
                {experience.map((exp, i) => (
                  <div key={i} className="relative pl-4 border-l border-gray-200">
                    <div className="absolute w-2 h-2 rounded-full -left-[4.5px] top-1.5" style={{ backgroundColor: color }}></div>
                    <div className="text-xs text-gray-400 mb-1">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </div>
                    <h3 className="font-bold text-base mb-1" style={{ color }}>{exp.position}</h3>
                    <div className="text-sm font-medium text-gray-500 mb-3">{exp.company}</div>
                    <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Education</h2>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="text-xs text-gray-400 mb-1">
                      {edu.startDate} — {edu.endDate}
                    </div>
                    <h3 className="font-bold text-base mb-1" style={{ color }}>{edu.degree}</h3>
                    <div className="text-sm text-gray-600">{edu.school}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecutiveTemplate({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, languages, summary, accentColor } = data;
  const color = accentColor || '#b45309'; // Default amber/gold

  return (
    <div className="min-h-[297mm] bg-gray-50 text-gray-800 flex flex-col">
      {/* Header Banner */}
      <div className="bg-gray-900 text-white p-10 flex items-center gap-8 border-b-4" style={{ borderColor: color }}>
        {personalInfo.photoUrl && (
          <img src={personalInfo.photoUrl} alt="Profile" className="w-32 h-32 rounded-lg object-cover shadow-lg border-2 border-gray-700" crossOrigin="anonymous" />
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-wide mb-2 uppercase">{personalInfo.firstName} {personalInfo.lastName}</h1>
          <p className="text-xl font-light mb-4" style={{ color }}>{personalInfo.jobTitle}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
            {personalInfo.email && <span className="flex items-center gap-2">✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-2">☎ {personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-2">📍 {personalInfo.location}</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Column */}
        <div className="w-[65%] p-10 bg-white">
          {summary && (
            <div className="mb-10">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-4 h-4" style={{ backgroundColor: color }}></span> Profile
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{summary}</p>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-4 h-4" style={{ backgroundColor: color }}></span> Professional Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-1">
                      <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                      <span className="text-sm font-bold" style={{ color }}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">{exp.company}</div>
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-4 h-4" style={{ backgroundColor: color }}></span> Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-1">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <span className="text-sm font-bold" style={{ color }}>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-600">{edu.school}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-[35%] p-10 bg-gray-50 border-l border-gray-200">
          {skills && skills.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b-2 pb-2" style={{ borderColor: color }}>Core Competencies</h2>
              <div className="space-y-4">
                {skills.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>{s.name}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ 
                        backgroundColor: color,
                        width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '80%' : s.level === 'Intermediate' ? '60%' : '40%' 
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b-2 pb-2" style={{ borderColor: color }}>Languages</h2>
              <div className="space-y-3">
                {languages.map((l, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-bold">{l.name}</span>
                    <span className="px-2 py-1 bg-gray-200 text-xs rounded font-medium">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreativeTemplate({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, languages, summary, accentColor } = data;
  const color = accentColor || '#10b981';

  return (
    <div className="min-h-[297mm] bg-white text-gray-800 p-10 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: color }}></div>

      <div className="flex gap-8 mb-12 relative z-10">
        {personalInfo.photoUrl && (
          <div className="flex-shrink-0">
            <img src={personalInfo.photoUrl} alt="Profile" className="w-40 h-40 object-cover rounded-2xl shadow-xl" crossOrigin="anonymous" />
          </div>
        )}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-black tracking-tighter mb-2">
            {personalInfo.firstName} <span style={{ color }}>{personalInfo.lastName}</span>
          </h1>
          <p className="text-xl font-medium text-gray-500 mb-4">{personalInfo.jobTitle}</p>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
            {personalInfo.email && <span className="bg-gray-100 px-3 py-1 rounded-full">{personalInfo.email}</span>}
            {personalInfo.phone && <span className="bg-gray-100 px-3 py-1 rounded-full">{personalInfo.phone}</span>}
            {personalInfo.location && <span className="bg-gray-100 px-3 py-1 rounded-full">{personalInfo.location}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          {summary && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                <span className="w-8 h-1 rounded" style={{ backgroundColor: color }}></span> About Me
              </h2>
              <p className="text-sm leading-relaxed text-gray-600 font-medium bg-gray-50 p-6 rounded-2xl whitespace-pre-line">
                {summary}
              </p>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <span className="w-8 h-1 rounded" style={{ backgroundColor: color }}></span> Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, i) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-2xl relative border-l-4" style={{ borderColor: color }}>
                    <h3 className="font-black text-lg mb-1">{exp.position}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-700">{exp.company}</span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-4">
          {education && education.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-6 h-1 rounded" style={{ backgroundColor: color }}></span> Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <div className="text-sm font-medium text-gray-500 mb-1">{edu.school}</div>
                    <div className="text-xs font-bold" style={{ color }}>{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-6 h-1 rounded" style={{ backgroundColor: color }}></span> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-bold text-gray-700 border-b-2" style={{ borderBottomColor: color }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-6 h-1 rounded" style={{ backgroundColor: color }}></span> Languages
              </h2>
              <div className="space-y-3">
                {languages.map((l, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="font-bold text-sm">{l.name}</span>
                    <span className="text-xs font-bold" style={{ color }}>{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
