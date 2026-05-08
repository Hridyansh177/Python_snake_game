import React, { useState, useEffect } from 'react';
import { Incident, GridDevice, Measurement } from '@/entities/all';
import { motion } from 'framer-motion';
import { Zap, Activity, TrendingUp, Users } from 'lucide-react';

import AlarmBanner from '../components/dashboard/AlarmBanner';
import ConfidenceScore from '../components/dashboard/ConfidenceScore';
import MicroTrendChart from '../components/dashboard/MicroTrendChart';
import OperatorActions from '../components/dashboard/OperatorActions';

export default function Dashboard() {
  const [activeIncident, setActiveIncident] = useState(null);
  const [measurements, setMeasurements] = useState({
    current: [],
    voltage: [],
    thd: [],
    frequency: []
  });
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(0);

  useEffect(() => {
    loadData();
    
    // Simulate real-time data updates
    const interval = setInterval(() => {
      updateMeasurements();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const incidents = await Incident.list('-created_date', 1);
    if (incidents.length > 0 && incidents[0].status === 'active') {
      setActiveIncident(incidents[0]);
      setConfidenceScore(incidents[0].confidence_score);
    }
  };

  const updateMeasurements = () => {
    const now = new Date();
    const newDataPoint = (baseValue, variance) => ({
      timestamp: now.toISOString(),
      value: baseValue + (Math.random() - 0.5) * variance
    });

    setMeasurements(prev => ({
      current: [...prev.current.slice(-9), newDataPoint(150, 20)],
      voltage: [...prev.voltage.slice(-9), newDataPoint(230, 10)],
      thd: [...prev.thd.slice(-9), newDataPoint(2.1, 0.5)],
      frequency: [...prev.frequency.slice(-9), newDataPoint(50.0, 0.2)]
    }));
  };

  const handleOperatorAction = async (action) => {
    switch (action) {
      case 'acknowledge':
        // Acknowledge the incident
        if (activeIncident) {
          await Incident.update(activeIncident.id, { 
            status: 'acknowledged',
            actions_taken: [
              ...activeIncident.actions_taken || [],
              {
                action: 'acknowledged',
                timestamp: new Date().toISOString(),
                result: 'success'
              }
            ]
          });
        }
        break;
      case 'trip':
        // Manual trip action
        break;
      case 'block_reclose':
        // Block reclose action
        break;
      case 'restore':
        // Restore service action
        break;
      case 'toggle_mode':
        setIsAutoMode(!isAutoMode);
        break;
    }
  };

  const handleAlarmDismiss = () => {
    setActiveIncident(null);
    setConfidenceScore(0);
    setIsAutoMode(100);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Grid Control Center</h1>
          <p className="text-slate-600">Real-time fault detection and system monitoring</p>
        </div>

        {/* Alarm Banner */}
        {activeIncident && (
          <AlarmBanner
            incident={activeIncident}
            onAcknowledge={() => handleOperatorAction('acknowledge')}
            onDismiss={handleAlarmDismiss}
          />
        )}

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Confidence Score */}
          <div className="lg:col-span-1">
            <ConfidenceScore score={confidenceScore} trend={2.5} />
          </div>

          {/* Micro-trend Charts */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <MicroTrendChart
                title="Phase Current"
                data={measurements.current}
                color="#3B82F6"
                icon={Zap}
                unit="A"
              />
              <MicroTrendChart
                title="Line Voltage"
                data={measurements.voltage}
                color="#10B981"
                icon={Activity}
                unit="V"
              />
              <MicroTrendChart
                title="THD"
                data={measurements.thd}
                color="#F59E0B"
                icon={TrendingUp}
                unit="%"
              />
              <MicroTrendChart
                title="Frequency"
                data={measurements.frequency}
                color="#8B5CF6"
                icon={Activity}
                unit="Hz"
              />
            </div>
          </div>

          {/* Operator Actions */}
          <div className="lg:col-span-1">
            <OperatorActions
              incident={activeIncident}
              onAction={handleOperatorAction}
              isAutoMode={isAutoMode}
            />
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Customers</p>
                <p className="text-2xl font-bold text-slate-900">12,847</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              <span>• 100% Online</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Devices</p>
                <p className="text-2xl font-bold text-slate-900">156</p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              <span>• All Operational</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Load Factor</p>
                <p className="text-2xl font-bold text-slate-900">78%</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2 text-sm text-orange-600">
              <span>• Peak Hours</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">System Health</p>
                <p className="text-2xl font-bold text-slate-900">99.8%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              <span>• Excellent</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}