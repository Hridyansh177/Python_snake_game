import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Activity, Zap, Clock } from 'lucide-react';
import FaultSimulator from '../components/simulator/FaultSimulator';

export default function Simulator() {
  const [simulationHistory, setSimulationHistory] = useState([]);

  const handleFaultTriggered = (incident) => {
    setSimulationHistory(prev => [incident, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-slate-600" />
            <h1 className="text-3xl font-bold text-slate-900">Fault Simulator</h1>
          </div>
          <p className="text-slate-600">Demo fault injection and system testing environment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Simulator */}
          <div className="lg:col-span-2">
            <FaultSimulator onFaultTriggered={handleFaultTriggered} />
          </div>

          {/* Simulation History */}
          <div>
            <Card className="shadow-lg border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Simulation History</CardTitle>
              </CardHeader>
              <CardContent>
                {simulationHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No simulations run yet</p>
                    <p className="text-sm">Start a fault simulation to see history</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {simulationHistory.map((incident, index) => (
                      <div
                        key={incident.id}
                        className="p-3 border border-slate-200 rounded-lg bg-white"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-slate-600" />
                            <span className="font-medium text-slate-900 text-sm">
                              {incident.fault_type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {incident.confidence_score}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(incident.detection_time).toLocaleTimeString()}
                        </div>
                        <div className="mt-2 text-xs text-slate-600">
                          {incident.customers_affected} customers affected
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Metrics */}
            <Card className="shadow-lg border border-slate-200 mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">System Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Detection Latency</span>
                  <span className="text-sm font-medium">127ms avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">False Positive Rate</span>
                  <span className="text-sm font-medium">0.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Response Time</span>
                  <span className="text-sm font-medium">450ms avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Simulations Run</span>
                  <span className="text-sm font-medium">{simulationHistory.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}