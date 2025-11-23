// src/utils/spark.ts
export function pointsFromArray(arr: number[], width = 120, height = 28) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min || 1;
  return arr.map((v, i) => {
    const x = (i / (arr.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
}
