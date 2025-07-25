import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useContacts } from '../context/ContactContext';
import * as echarts from 'echarts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRefreshCw } = FiIcons;

const NetworkGraph = () => {
  const { contacts, relationships } = useContacts();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [loading, setLoading] = useState(false);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      // Resize chart on window resize
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
        chartInstance.current = null;
      };
    }
  }, []);

  // Update chart whenever contacts or relationships change
  useEffect(() => {
    if (!chartInstance.current) return;
    updateChart();
  }, [contacts, relationships]);

  const updateChart = () => {
    if (!chartInstance.current || !contacts.length) return;
    
    setLoading(true);
    
    // Prepare data for network graph
    const nodes = [];
    const edges = [];
    
    // First node is always "Ich" (self) at the center
    nodes.push({
      id: 'self',
      name: 'Ich',
      symbolSize: 50,
      itemStyle: {
        color: '#3B82F6',
        borderColor: '#1E40AF',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'inside',
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold'
      },
      value: 100,
      category: 'self'
    });
    
    // Add contact nodes
    contacts.forEach(contact => {
      nodes.push({
        id: contact.id,
        name: contact.name,
        symbolSize: 20 + (contact.importance || 1) * 4,
        itemStyle: {
          color: getCategoryColor(contact.category),
          borderColor: getBorderColor(contact.category),
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          distance: 5,
          fontSize: 12
        },
        tooltip: {
          formatter: function(params) {
            return `<div style="font-weight:bold">${contact.name}</div>
                    <div>Kategorie: ${contact.category}</div>
                    <div>Status: ${contact.relationshipStatus}</div>`;
          }
        },
        value: contact.importance * 20,
        category: contact.category || 'other'
      });
      
      // Add edges from self to all contacts
      edges.push({
        source: 'self',
        target: contact.id,
        lineStyle: {
          color: getRelationshipStatusColor(contact.relationshipStatus),
          width: 1.5,
          curveness: 0.1
        },
        symbolSize: [0, 6],
        label: {
          show: false,
          formatter: contact.relationshipStatus,
          fontSize: 10
        }
      });
    });
    
    // Add relationships between contacts
    relationships.forEach(rel => {
      const sourceId = rel.sourceId;
      const targetId = rel.targetId;
      
      // Add edge between contacts
      edges.push({
        source: sourceId,
        target: targetId,
        lineStyle: {
          color: getRelationshipColor(rel.type),
          width: 2,
          type: rel.type === 'neutral' ? 'dashed' : 'solid',
          curveness: 0.1
        },
        tooltip: {
          formatter: function() {
            const sourceContact = contacts.find(c => c.id === sourceId) || { name: 'Ich' };
            const targetContact = contacts.find(c => c.id === targetId) || { name: 'Ich' };
            const sourceName = sourceId === 'self' ? 'Ich' : sourceContact.name;
            const targetName = targetId === 'self' ? 'Ich' : targetContact.name;
            
            return `<div>${sourceName} → ${targetName}</div>
                    <div>Beziehung: ${rel.type}</div>
                    ${rel.notes ? `<div>Notizen: ${rel.notes}</div>` : ''}`;
          }
        }
      });
    });
    
    // Set up categories for legend
    const categories = [
      { name: 'self', itemStyle: { color: '#3B82F6' } },
      { name: 'freund', itemStyle: { color: getCategoryColor('freund') } },
      { name: 'familie', itemStyle: { color: getCategoryColor('familie') } },
      { name: 'kunde', itemStyle: { color: getCategoryColor('kunde') } },
      { name: 'mentor', itemStyle: { color: getCategoryColor('mentor') } },
      { name: 'feind', itemStyle: { color: getCategoryColor('feind') } },
      { name: 'rivale', itemStyle: { color: getCategoryColor('rivale') } },
      { name: 'neider', itemStyle: { color: getCategoryColor('neider') } },
      { name: 'other', itemStyle: { color: '#6B7280' } }
    ];
    
    // Configure chart
    const option = {
      title: {
        text: 'Beziehungsnetzwerk',
        subtext: 'Verbindungen zwischen Kontakten',
        top: 'top',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        textStyle: {
          color: '#333'
        }
      },
      legend: {
        data: categories.filter(cat => cat.name !== 'self' && cat.name !== 'other').map(cat => ({
          name: cat.name,
          icon: 'circle'
        })),
        orient: 'vertical',
        left: 'left',
        top: 50,
        selectedMode: 'multiple',
        formatter: function(name) {
          return name.charAt(0).toUpperCase() + name.slice(1);
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          restore: {},
          dataView: { readOnly: true }
        }
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: edges,
          categories: categories,
          roam: true,
          draggable: true,
          label: {
            show: true,
            position: 'right',
            fontSize: 12
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [0, 8],
          force: {
            repulsion: 200,
            edgeLength: [50, 150],
            gravity: 0.1,
            layoutAnimation: true
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 5
            },
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          lineStyle: {
            color: 'source',
            curveness: 0.1,
            width: 2
          },
          animationDuration: 1500,
          animationEasingUpdate: 'quinticInOut',
          center: ['50%', '50%']
        }
      ]
    };
    
    // Apply chart configuration with animation
    chartInstance.current.setOption(option, true);
    
    // Ensure layout is calculated and nodes are distributed properly
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  
  const handleRefreshLayout = () => {
    if (chartInstance.current) {
      setLoading(true);
      chartInstance.current.setOption({
        series: [{
          force: {
            layoutAnimation: true
          }
        }]
      });
      
      // Refresh the layout
      chartInstance.current.setOption({
        series: [{
          force: {
            repulsion: 200,
            edgeLength: [50, 150],
            gravity: 0.1,
            layoutAnimation: true
          }
        }]
      });
      
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };
  
  // Helper functions for colors
  const getCategoryColor = (category) => {
    switch (category) {
      case 'freund': return '#3B82F6'; // blue
      case 'familie': return '#8B5CF6'; // purple
      case 'kunde': return '#10B981'; // green
      case 'mentor': return '#6366F1'; // indigo
      case 'feind': return '#EF4444'; // red
      case 'rivale': return '#F97316'; // orange
      case 'neider': return '#F59E0B'; // amber
      default: return '#6B7280'; // gray
    }
  };
  
  const getBorderColor = (category) => {
    switch (category) {
      case 'freund': return '#1D4ED8'; // darker blue
      case 'familie': return '#7C3AED'; // darker purple
      case 'kunde': return '#059669'; // darker green
      case 'mentor': return '#4F46E5'; // darker indigo
      case 'feind': return '#DC2626'; // darker red
      case 'rivale': return '#EA580C'; // darker orange
      case 'neider': return '#D97706'; // darker amber
      default: return '#4B5563'; // darker gray
    }
  };
  
  const getRelationshipColor = (type) => {
    switch (type) {
      case 'positiv': return '#22C55E'; // green
      case 'negativ': return '#EF4444'; // red
      default: return '#000000'; // black for neutral
    }
  };
  
  const getRelationshipStatusColor = (status) => {
    switch (status) {
      case 'aktiv': return '#22C55E'; // green
      case 'passiv': return '#F59E0B'; // amber
      case 'unterbrochen': return '#F97316'; // orange
      case 'toxisch': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Netzwerkgraph</h1>
        <p className="text-gray-600">Visualisierung der Beziehungen zwischen Kontakten</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Beziehungsnetzwerk</h2>
            <p className="text-sm text-gray-500">
              {contacts.length} Kontakte, {relationships.length} Verbindungen
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Positiv</span>
              </div>
              <div className="flex items-center ml-2">
                <div className="w-3 h-3 rounded-full bg-black mr-1"></div>
                <span>Neutral</span>
              </div>
              <div className="flex items-center ml-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>Negativ</span>
              </div>
            </div>
            <button 
              className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
              onClick={handleRefreshLayout}
              disabled={loading}
            >
              <SafeIcon icon={FiRefreshCw} className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Layout
            </button>
          </div>
        </div>
        
        <div 
          ref={chartRef} 
          className="w-full border border-gray-100 rounded-lg"
          style={{ height: '600px' }}
        />
        
        <div className="mt-4 text-sm text-gray-500">
          <p>
            <strong>Interaktion:</strong> Zoomen mit Mausrad, Verschieben mit Drag & Drop, Knoten können per Drag & Drop verschoben werden.
            Klicken Sie auf einen Kontakt, um dessen Verbindungen hervorzuheben.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NetworkGraph;