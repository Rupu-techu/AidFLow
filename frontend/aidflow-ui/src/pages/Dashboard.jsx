import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  AlertTriangle, Activity, MapPin, Send, Loader2,
  ShieldAlert, Clock, Users, Package, Brain,
  ChevronDown, ChevronUp
} from 'lucide-react';

import { processDisaster } from "../services/disasterService";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Idle');
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setStatus("Processing");

    try {
      const data = await processDisaster(text);
      setResults(data);
      setStatus("Success");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (typeof severity === 'string' ? severity.toLowerCase() : '') {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background text-foreground">

      {/* HEADER */}
      <header className="mb-8 flex justify-between items-center border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">AidFlow</h1>
            <p className="text-sm text-muted-foreground uppercase">Command Center</p>
          </div>
        </div>

        <Badge>
          <Activity className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      </header>

      {/* MAIN */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT - INPUT */}
        <Card>
          <CardHeader>
            <CardTitle>Report Situation</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Flood in Assam, 200 people affected..."
                className="w-full min-h-[300px] p-4 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                disabled={loading}
              />

              {error && (
                <p className="text-red-500">{error}</p>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" />
                    Analyze Situation
                  </>
                )}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* RIGHT - RESULTS */}
        <div className="space-y-6">

          {!results && !loading && (
            <Card className="p-8 text-center text-muted-foreground">
              No data yet
            </Card>
          )}

          {loading && (
            <Card className="p-8 text-center">
              <Loader2 className="animate-spin mx-auto" />
              <p>Processing...</p>
            </Card>
          )}

          {results && (
            <div className="animate-fadeIn">
            </div>
          )}
          <>
            {/* SUMMARY */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><b>Location:</b> {results.location}</p>
                <p>
                  <b>Severity:</b>{" "}
                  <Badge className={`${getSeverityColor(results.severity)} glow`}>
                    {results.severity}
                  </Badge>
                </p>
                <p><b>Urgency:</b> {results.urgency}</p>
                <p>
                  <b>Priority:</b>{" "}
                  <span className="text-3xl font-bold text-purple-400 glow">
                    {results.priority_score}
                  </span>
                </p>
                <p><b>Need:</b> {results.need_type}</p>
                <p><b>People:</b> {results.people_count}</p>
              </CardContent>
            </Card>


            {/* VOLUNTEERS */}
            {results.volunteer_plan && (
              <Card>
                <CardHeader>
                  <CardTitle>Volunteers</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.volunteer_plan.map((v, i) => (
                    <div key={i} className="mb-2">
                      <p><b>{v.name}</b> - {v.role}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* REASONING */}
            {results.reasoning_summary && (
              <Card>
                <button
                  onClick={() => setIsReasoningOpen(!isReasoningOpen)}
                  className="w-full p-4 flex justify-between"
                >
                  AI Reasoning
                  {isReasoningOpen ? <ChevronUp /> : <ChevronDown />}
                </button>

                {isReasoningOpen && (
                  <CardContent>
                    {results.reasoning_summary}
                  </CardContent>
                )}
              </Card>
            )}
          </>
          )}

        </div>

      </main>
    </div>
  );
}