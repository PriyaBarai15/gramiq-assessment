import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar } from 'recharts';

export default function TrendChart({ forecast }) {
  console.log(forecast);
  
  const data = forecast.slice(0, 16).map(item => ({
    time: item.dt_txt.slice(5, 16),
    temp: item.temp,
    pop: Math.round((item.pop || 0) * 100)
  }));

  return (
    <div className='chart-container'>
      <h4>Temperature & Rain trend (next ~48 h)</h4>
      <div style={{ height: 450 }}>
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" domain={['dataMin - 1', 'dataMax + 1']} />
          <YAxis yAxisId="right" orientation="right" domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ff7300" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="pop" stroke="#387908" dot={false} />
        </LineChart>
      </ResponsiveContainer>
        
      </div>
    </div>
  );
}
