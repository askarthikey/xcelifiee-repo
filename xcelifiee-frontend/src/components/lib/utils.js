// utils/index.js
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)
}

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return ((value / total) * 100).toFixed(1)
}

export const processChartData = (data, key) => {
  return data.reduce((acc, item) => {
    const existingItem = acc.find(x => x[key] === item[key])
    if (existingItem) {
      existingItem.count++
    } else {
      acc.push({ [key]: item[key], count: 1 })
    }
    return acc
  }, [])
}