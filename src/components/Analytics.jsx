import React from 'react';
import { motion } from 'framer-motion';
import { useContacts } from '../context/ContactContext';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiUsers, FiHeart, FiAlertTriangle } = FiIcons;

const Analytics = () => {
  const { contacts } = useContacts();

  // Category Distribution
  const categoryData = contacts.reduce((acc, contact) => {
    acc[contact.category] = (acc[contact.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartOption = {
    title: {
      text: 'Kontakte nach Kategorie',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: 'Kategorien',
      type: 'pie',
      radius: ['40%', '70%'],
      data: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // Relationship Status Distribution
  const statusData = contacts.reduce((acc, contact) => {
    acc[contact.relationshipStatus] = (acc[contact.relationshipStatus] || 0) + 1;
    return acc;
  }, {});

  const statusChartOption = {
    title: {
      text: 'Beziehungsstatus Verteilung',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: Object.keys(statusData)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: Object.values(statusData),
      type: 'bar',
      itemStyle: {
        color: function(params) {
          const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];
          return colors[params.dataIndex % colors.length];
        }
      }
    }]
  };

  // Trust vs Importance Scatter
  const scatterData = contacts.map(contact => [
    contact.trustLevel,
    contact.importance,
    contact.name
  ]);

  const scatterChartOption = {
    title: {
      text: 'Vertrauen vs. Wichtigkeit',
      left: 'center'
    },
    tooltip: {
      formatter: function(params) {
        return `${params.data[2]}<br/>Vertrauen: ${params.data[0]}<br/>Wichtigkeit: ${params.data[1]}`;
      }
    },
    xAxis: {
      name: 'Vertrauen',
      min: 1,
      max: 5,
      type: 'value'
    },
    yAxis: {
      name: 'Wichtigkeit',
      min: 1,
      max: 5,
      type: 'value'
    },
    series: [{
      type: 'scatter',
      data: scatterData,
      symbolSize: 20,
      itemStyle: {
        color: '#3B82F6'
      }
    }]
  };

  // Energy Balance
  const energyData = contacts.reduce((acc, contact) => {
    acc[contact.energyBalance] = (acc[contact.energyBalance] || 0) + 1;
    return acc;
  }, {});

  const stats = {
    totalContacts: contacts.length,
    averageTrust: contacts.length > 0 ? (contacts.reduce((sum, c) => sum + c.trustLevel, 0) / contacts.length).toFixed(1) : 0,
    averageImportance: contacts.length > 0 ? (contacts.reduce((sum, c) => sum + c.importance, 0) / contacts.length).toFixed(1) : 0,
    toxicContacts: contacts.filter(c => c.relationshipStatus === 'toxisch').length,
    energyGivers: contacts.filter(c => c.energyBalance === 'energiespendend').length,
    energyDrainers: contacts.filter(c => c.energyBalance === 'energieraubend').length
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Beziehungsanalyse</h1>
        <p className="text-gray-600">Erkenntnisse über dein persönliches Netzwerk</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Durchschn. Vertrauen</p>
              <p className="text-2xl font-bold text-blue-600">{stats.averageTrust}/5</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiHeart} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Durchschn. Wichtigkeit</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageImportance}/5</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Energiespender</p>
              <p className="text-2xl font-bold text-green-600">{stats.energyGivers}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Energieräuber</p>
              <p className="text-2xl font-bold text-red-600">{stats.energyDrainers}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <ReactECharts option={categoryChartOption} style={{ height: '300px' }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <ReactECharts option={statusChartOption} style={{ height: '300px' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <ReactECharts option={scatterChartOption} style={{ height: '300px' }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Energie-Bilanz</h3>
          <div className="space-y-4">
            {Object.entries(energyData).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="capitalize font-medium">{type}</span>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${
                    type === 'energiespendend' ? 'bg-green-500' :
                    type === 'energieraubend' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-2xl font-bold">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Erkenntnisse & Empfehlungen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-700 mb-2">Positive Trends</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {stats.energyGivers} Personen geben dir Energie</li>
              <li>• Durchschnittliches Vertrauenslevel: {stats.averageTrust}/5</li>
              <li>• {contacts.filter(c => c.potential === 'hoch').length} Kontakte mit hohem Potenzial</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-700 mb-2">Verbesserungsbereiche</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {stats.energyDrainers} Personen rauben dir Energie</li>
              <li>• {stats.toxicContacts} toxische Beziehungen identifiziert</li>
              <li>• {contacts.filter(c => c.relationshipStatus === 'unterbrochen').length} unterbrochene Beziehungen</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;