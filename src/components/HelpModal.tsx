import React from 'react';
import { X, BookOpen, FileSpreadsheet, Download, Upload, Zap } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-cyan-500/30 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/30 p-6 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-cyan-400">Help & Integration Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-cyan-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {/* Quick Start */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-200">
                💡 <strong>New to the dashboard?</strong> Check out the{' '}
                <a 
                  href="https://github.com/yourusername/stt-makati-bms/blob/main/QUICK_START_VISUAL.md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 underline hover:text-purple-200"
                >
                  Visual Quick Start Guide
                </a>
                {' '}for diagrams and step-by-step workflows!
              </p>
            </div>
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Start Guide
            </h3>
            <div className="space-y-3 text-slate-300">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-300 mb-2">1. Log Your First Reading</h4>
                <p>Click the <span className="text-cyan-400 font-semibold">+ Log Reading</span> button in the header. Choose between:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li><strong>Hourly Tab:</strong> Temperature, Humidity, IT Load, Total Power (per hall)</li>
                  <li><strong>Daily Tab:</strong> Energy consumption data (facility-wide)</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-300 mb-2">2. Monitor Live KPIs</h4>
                <p>The header shows real-time averages that update with each new log:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li><strong>Avg PUE:</strong> Power Usage Effectiveness (target: &lt;1.5)</li>
                  <li><strong>Avg Temp:</strong> Average temperature (optimal: 22-26°C)</li>
                  <li><strong>Avg Humidity:</strong> Average humidity (optimal: 45-60%)</li>
                  <li><strong>Total IT Load:</strong> Sum of all IT equipment power</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-300 mb-2">3. Analyze Trends</h4>
                <p>Use the Multi-Hall Trend Chart to compare all 5 halls. Toggle between TEMP/HUM/PUE. Yellow dashed lines show industry benchmarks.</p>
              </div>
            </div>
          </section>

          {/* Google Sheets Integration */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Google Sheets Integration
            </h3>
            
            <div className="space-y-4">
              {/* Export */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Download className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-green-300">Export to Google Sheets</h4>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                  <li>Click <span className="text-green-400 font-semibold">⬇ Export CSV</span> button in the header</li>
                  <li>File <code className="bg-slate-800 px-2 py-1 rounded text-green-400">bms-data-export.csv</code> downloads</li>
                  <li>Open <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-green-400 underline hover:text-green-300">Google Sheets</a></li>
                  <li>Create new spreadsheet: <strong>"STT Makati BMS Data"</strong></li>
                  <li>Click <strong>File → Import → Upload</strong></li>
                  <li>Drag and drop your CSV file</li>
                  <li>Import settings: <strong>Separator: Comma</strong>, <strong>Convert text to numbers: ✓</strong></li>
                  <li>Click <strong>Import data</strong></li>
                </ol>
                <p className="mt-3 text-sm text-green-300">✨ Your data is now in Google Sheets with proper formatting!</p>
              </div>

              {/* Import */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-blue-300">Import from Google Sheets</h4>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
                  <li>In Google Sheets, click <strong>File → Download → CSV</strong></li>
                  <li>Save the CSV file to your computer</li>
                  <li>In this dashboard, click <span className="text-blue-400 font-semibold">⬆ Import CSV</span></li>
                  <li>Select your CSV file</li>
                  <li>Data automatically merges with existing records</li>
                </ol>
                <p className="mt-3 text-sm text-blue-300">✨ Dashboard detects both hourly and daily formats automatically!</p>
              </div>

              {/* Sample Files */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-300 mb-3">📥 Download Sample Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <a
                    href="/sample-hourly-data.csv"
                    download
                    className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 p-3 rounded-lg border border-cyan-500/30 transition-colors"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300">Sample Hourly Data</span>
                  </a>
                  <a
                    href="/sample-daily-data.csv"
                    download
                    className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 p-3 rounded-lg border border-cyan-500/30 transition-colors"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300">Sample Daily Data</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Workflow Recommendations */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">🔄 Recommended Workflows</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold text-purple-300 mb-2">Small Team</h4>
                <p className="text-sm text-slate-300">Use dashboard as primary. Log readings here, export to Sheets daily for backup.</p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold text-blue-300 mb-2">Large Team</h4>
                <p className="text-sm text-slate-300">Use Sheets as primary. Multiple people edit, then import to dashboard for visualization.</p>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-semibold text-cyan-300 mb-2">Hybrid (Best!)</h4>
                <p className="text-sm text-slate-300">Monitor live on dashboard, store data in Sheets, sync daily both ways.</p>
              </div>
            </div>
          </section>

          {/* Key Metrics */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">📊 Understanding the Metrics</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-300">
                <thead>
                  <tr className="bg-slate-800 border-b border-cyan-500/30">
                    <th className="p-3 text-left text-cyan-300">Metric</th>
                    <th className="p-3 text-left text-green-300">🟢 Optimal</th>
                    <th className="p-3 text-left text-yellow-300">🟡 Acceptable</th>
                    <th className="p-3 text-left text-red-300">🔴 Critical</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700">
                    <td className="p-3 font-semibold">Temperature</td>
                    <td className="p-3">22-26°C</td>
                    <td className="p-3">20-28°C</td>
                    <td className="p-3">&lt;20°C or &gt;28°C</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-3 font-semibold">Humidity</td>
                    <td className="p-3">45-60%</td>
                    <td className="p-3">40-70%</td>
                    <td className="p-3">&lt;40% or &gt;70%</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-3 font-semibold">PUE</td>
                    <td className="p-3">&lt;1.5</td>
                    <td className="p-3">1.5-2.0</td>
                    <td className="p-3">&gt;2.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-xl font-bold text-cyan-400 mb-4">💡 Pro Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-sm text-slate-300">✅ Export from dashboard <strong>daily</strong> - don't lose data if browser clears</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-sm text-slate-300">✅ Use Google Sheets for <strong>backup</strong> - free unlimited storage</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-sm text-slate-300">✅ Click hall cards to <strong>highlight</strong> them on the trend chart</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-sm text-slate-300">✅ Set up Google Apps Script for <strong>automated alerts</strong></p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-sm text-slate-300">✅ Target PUE below <strong>1.5</strong> for world-class efficiency</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-sm text-slate-300">✅ Monitor every <strong>hour</strong> during business hours</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
