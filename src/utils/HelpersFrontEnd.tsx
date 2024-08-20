"use client";
export const frontHelperFunctions = {
  renderSheetData: (sheetData: string[][]) => {
    return (
      <table className="border-separate border border-slate-500 rounded-[20px]">
        <thead>
          <tr>
            {sheetData[0].map((col, index) => (
              <th key={index} className="border border-slate-600">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sheetData.slice(1).map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
