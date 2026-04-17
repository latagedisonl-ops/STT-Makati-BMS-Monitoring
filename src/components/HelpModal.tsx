import { X, Download, Upload, FileText } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-blue-500/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-blue-500/20 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Help & Documentation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-gray-300">
          {/* Quick Start */}
          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">🚀 Quick Start</h3>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li><strong>Log your first reading:</strong> Click "+ Log Reading" → Fill in the form → Save</li>
              <li><strong>Watch the dashboard update:</strong> Hall cards light up, KPIs update, charts populate!</li>
              <li><strong>Export your data:</strong> Click "Export CSV" to backup your logs</li>
              <li><strong>Import existing data:</strong> Click "Import CSV" to load data from files</li>
            </ol>
          </section>

          {/* CSV Format */}
          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">📄 CSV Import/Export</h3>
            <p className="mb-3">This app supports <strong>multiple CSV formats</strong>:</p>
            
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-4 h-4 text-green-400" />
                  <h4 className="font-bold text-green-400">App Export Format</h4>
                </div>
                <p className="text-sm mb-2">When you click "Export CSV", the file contains:</p>
                <pre className="bg-slate-900 p-3 rounded text-xs overflow-x-auto text-blue-300">
{`HOURLY LOGS
Timestamp,Hall,Hour,Temperature,Humidity,IT Load,Total Power,PUE
2026-04-17 14:30:00,A,14:00,25.5,55.0,150.00,225.00,1.50

DAILY LOGS
Date,Total Utility,Cooling,IT,Others,SUPS Loss,TX Loss,PUE
2026-04-17,6200.00,1200.00,3600.00,800.00,200.00,400.00,1.72`}
                </pre>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <h4 className="font-bold text-blue-400">Sample CSV Format (Also Supported!)</h4>
                </div>
                <p className="text-sm mb-2">You can also import simple CSV files like:</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-amber-400 mb-1">Hourly Format:</p>
                    <pre className="bg-slate-900 p-3 rounded text-xs overflow-x-auto text-blue-300">
{`Hall,Date,Hour,Temperature (°C),Humidity (%),IT Load (kW),Total Power (kW),PUE
A,2026-04-17,0,24.5,55,150,200,1.33
B,2026-04-17,0,25.0,58,180,240,1.33`}
                    </pre>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-amber-400 mb-1">Daily Format:</p>
                    <pre className="bg-slate-900 p-3 rounded text-xs overflow-x-auto text-blue-300">
{`Date,Total Utility (kWh),Cooling (kWh),IT (kWh),Others (kWh),SUPS Loss (kWh),TX Loss (kWh),PUE
2026-04-13,10000,5000,4000,500,300,200,1.43
2026-04-14,9800,4900,3950,480,290,180,1.42`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-2">
                <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-400 mb-1">✨ Smart Parser</p>
                  <p className="text-sm">
                    The app automatically detects the format! Just click "Import CSV" and select your file.
                    It works with both the app's export format and standard sample CSVs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">🔧 Troubleshooting CSV Import</h3>
            <div className="space-y-3">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="font-bold text-amber-400 mb-2">⚠️ Common Issues:</p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li><strong>No data shows after import?</strong> Check your CSV has the correct column headers</li>
                  <li><strong>Date format errors?</strong> Use YYYY-MM-DD format (e.g., 2026-04-17)</li>
                  <li><strong>Numbers not parsing?</strong> Don't use commas in numbers (use 1000 not 1,000)</li>
                  <li><strong>Mixed formats?</strong> Keep hourly and daily data in separate files when using sample format</li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="font-bold text-green-400 mb-2">✅ Best Practices:</p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li>Export your data daily for backup</li>
                  <li>Test import with a small CSV file first</li>
                  <li>Keep original files before editing</li>
                  <li>Use Excel or Google Sheets to edit CSVs safely</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Metrics Reference */}
          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">📊 Metrics Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-600 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="p-3 text-left text-blue-300">Metric</th>
                    <th className="p-3 text-left text-green-400">🟢 Optimal</th>
                    <th className="p-3 text-left text-amber-400">🟡 Acceptable</th>
                    <th className="p-3 text-left text-red-400">🔴 Critical</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-600">
                    <td className="p-3 font-medium">Temperature</td>
                    <td className="p-3">18-27°C</td>
                    <td className="p-3">15-18°C or 27-30°C</td>
                    <td className="p-3">&lt;15°C or &gt;30°C</td>
                  </tr>
                  <tr className="border-t border-slate-600">
                    <td className="p-3 font-medium">Humidity</td>
                    <td className="p-3">40-70%</td>
                    <td className="p-3">30-40% or 70-80%</td>
                    <td className="p-3">&lt;30% or &gt;80%</td>
                  </tr>
                  <tr className="border-t border-slate-600">
                    <td className="p-3 font-medium">PUE</td>
                    <td className="p-3">≤ 1.5</td>
                    <td className="p-3">1.5-2.0</td>
                    <td className="p-3">&gt; 2.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Pro Tips */}
          <section>
            <h3 className="text-xl font-bold text-blue-300 mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 ml-2">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>Click hall cards to highlight them on charts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>Target PUE &lt; 1.5 for world-class efficiency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>Data is saved in your browser - export daily to backup!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>Use Google Sheets for team collaboration</span>
              </li>
            </ul>
          </section>

          <div className="border-t border-slate-600 pt-4 text-center text-sm text-gray-500">
            <p>STT Makati BMS Monitoring System v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
