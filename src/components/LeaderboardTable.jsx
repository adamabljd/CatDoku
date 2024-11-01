// LeaderboardTable.js
import React from 'react';

const LeaderboardTable = ({ title, data, difficulties, mistakesOptions, formatTime }) => {
  return (
    <div className="w-full bg-stone-100 p-3 rounded-lg shadow-md">
      <h3 className="font-semibold">{title}</h3>
      <div className="overflow-x-auto w-full mt-2">
        <table className="min-w-full border-collapse border-2 border-slate-950">
          <thead>
            <tr>
              <th className="p-2 border border-slate-950">Mistakes</th>
              {difficulties.map((difficulty) => (
                <th key={difficulty} className="p-2 border border-slate-950">
                  {difficulty}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mistakesOptions.map((mistakes) => (
              <tr key={mistakes}>
                <td className="p-2 font-semibold border border-slate-950">
                  {mistakes === Infinity ? "Unlimited" : mistakes}
                </td>
                {difficulties.map((difficulty) => (
                  <td key={difficulty} className="p-2 border border-slate-950">
                    {title === "Best Time"
                      ? formatTime(data[difficulty]?.[mistakes])
                      : data[difficulty]?.[mistakes] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
