import { addHours, startOfDay, addDays, addWeeks, differenceInDays, endOfWeek, format, startOfWeek, endOfWeek, min } from 'date-fns';
import { DateRange } from 'react-day-picker';

export interface TimeSeriesDataPoint {
  timestamp: Date;
  Voicemail: number;
  Transferred: number;
  Busy: number;
  Blocked: number;
  'Do Not Call': number;
}

export interface CallVolumeDataPoint {
  timestamp: Date;
  Inbound: number;
  Outbound: number;
}

export function generateTimeSeriesData(): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  const today = startOfDay(new Date());

  // Generate data for business hours (8am - 7pm)
  for (let hour = 8; hour <= 19; hour++) {
    data.push({
      timestamp: addHours(today, hour),
      Voicemail: Math.floor(Math.random() * 100) + 50,
      Transferred: Math.floor(Math.random() * 150) + 100,
      Busy: Math.floor(Math.random() * 100) + 50,
      Blocked: Math.floor(Math.random() * 80) + 20,
      'Do Not Call': Math.floor(Math.random() * 50) + 10,
    });
  }

  return data;
}

export function generateCallVolumeData(dateRange: DateRange | undefined) {
  if (!dateRange?.from || !dateRange?.to) return []
  
  const startDate = new Date(dateRange.from)
  const endDate = new Date(dateRange.to)
  endDate.setHours(23, 59, 59, 999) // Set end date to end of day
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Invalid date range:', dateRange)
    return []
  }
  
  const diffDays = differenceInDays(endDate, startDate)
  const data = []
  
  if (diffDays <= 2) {
    // Hourly data generation for 0-2 days (all 24 hours)
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dayEnd = new Date(currentDate)
      dayEnd.setHours(23, 59, 59, 999)
      
      for (let hour = 0; hour < 24; hour++) {
        const hourDate = new Date(currentDate)
        hourDate.setHours(hour, 0, 0, 0)
        
        if (hourDate >= startDate && hourDate <= endDate) {
          data.push({
            timestamp: hourDate,
            Inbound: Math.floor(Math.random() * 200) + 100,
            Outbound: Math.floor(Math.random() * 300) + 150
          })
        }
      }
      currentDate = addDays(currentDate, 1)
    }
  } else if (diffDays <= 14) {
    // Daily data generation for 3-14 days
    let currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      data.push({
        timestamp: new Date(currentDate),
        Inbound: Math.floor(Math.random() * 200) + 100,
        Outbound: Math.floor(Math.random() * 300) + 150
      })
      
      // Move to next day
      currentDate = addDays(currentDate, 1)
    }
  } else {
    // Weekly data generation for >14 days
    let currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      let weekEnd = addDays(currentDate, 6)
      if (weekEnd > endDate) {
        weekEnd = new Date(endDate)
      }

      data.push({
        timestamp: new Date(currentDate),
        weekEnd: new Date(weekEnd),
        Inbound: Math.floor(Math.random() * 200) + 100,
        Outbound: Math.floor(Math.random() * 300) + 150
      })

      // Move to next week
      currentDate = addDays(currentDate, 7)
    }
  }
  
  // Sort and validate data before returning
  return data
    .filter(d => 
      d.timestamp instanceof Date && 
      !isNaN(d.timestamp.getTime())
    )
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

export function generateDispositionsData(dateRange: DateRange | undefined) {
  if (!dateRange?.from || !dateRange?.to) return []
  
  const startDate = new Date(dateRange.from)
  const endDate = new Date(dateRange.to)
  endDate.setHours(23, 59, 59, 999)
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Invalid date range:', dateRange)
    return []
  }
  
  const diffDays = differenceInDays(endDate, startDate)
  const data = []
  
  if (diffDays <= 2) {
    // Hourly data for 0-2 days
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      for (let hour = 0; hour < 24; hour++) {
        const hourDate = new Date(currentDate)
        hourDate.setHours(hour, 0, 0, 0)
        
        if (hourDate >= startDate && hourDate <= endDate) {
          data.push({
            timestamp: hourDate,
            Voicemail: Math.floor(Math.random() * 100) + 50,
            Transferred: Math.floor(Math.random() * 150) + 100,
            Busy: Math.floor(Math.random() * 80) + 30,
            Blocked: Math.floor(Math.random() * 40) + 10,
            "Do Not Call": Math.floor(Math.random() * 30) + 10
          })
        }
      }
      currentDate = addDays(currentDate, 1)
    }
  } else if (diffDays <= 14) {
    // Daily data for 3-14 days
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      data.push({
        timestamp: new Date(currentDate),
        Voicemail: Math.floor(Math.random() * 200) + 100,
        Transferred: Math.floor(Math.random() * 300) + 150,
        Busy: Math.floor(Math.random() * 150) + 50,
        Blocked: Math.floor(Math.random() * 80) + 20,
        "Do Not Call": Math.floor(Math.random() * 60) + 20
      })
      currentDate = addDays(currentDate, 1)
    }
  } else {
    // Weekly data for >14 days
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const weekEnd = min([addDays(currentDate, 6), endDate])
      
      data.push({
        timestamp: new Date(currentDate),
        weekEnd: new Date(weekEnd),
        Voicemail: Math.floor(Math.random() * 800) + 400,
        Transferred: Math.floor(Math.random() * 1200) + 600,
        Busy: Math.floor(Math.random() * 600) + 200,
        Blocked: Math.floor(Math.random() * 300) + 100,
        "Do Not Call": Math.floor(Math.random() * 200) + 50
      })
      
      currentDate = addDays(currentDate, 7)
    }
  }
  
  return data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}