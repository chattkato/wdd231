// js/data.js - Data loading and management module

const DATA_URL = './data/satellites.json';

/**
 * Fetch satellite data from JSON file
 * @returns {Promise<Array>} Array of satellite objects
 */
export async function fetchSatellites() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.satellites;
  } catch (error) {
    console.error('Failed to load satellite data:', error);
    throw error;
  }
}

/**
 * Get unique values from satellite data for filters
 * @param {Array} satellites - Array of satellite objects
 * @param {string} key - Property key to extract unique values from
 * @returns {Array} Unique values
 */
export function getUniqueValues(satellites, key) {
  const values = satellites.map(sat => sat[key]).filter(Boolean);
  return [...new Set(values)].sort();
}

/**
 * Get unique operators from satellite data
 * @param {Array} satellites - Array of satellite objects
 * @returns {Array} Unique operators
 */
export function getUniqueOperators(satellites) {
  const operators = satellites.map(sat => sat.operator).filter(Boolean);
  return [...new Set(operators)].sort();
}

/**
 * Get unique orbit types from satellite data
 * @param {Array} satellites - Array of satellite objects
 * @returns {Array} Unique orbit types
 */
export function getUniqueOrbits(satellites) {
  const orbits = satellites.map(sat => sat.orbit).filter(Boolean);
  return [...new Set(orbits)].sort();
}

/**
 * Get unique satellite types from satellite data
 * @param {Array} satellites - Array of satellite objects
 * @returns {Array} Unique satellite types
 */
export function getUniqueTypes(satellites) {
  const types = satellites.map(sat => sat.type).filter(Boolean);
  return [...new Set(types)].sort();
}

/**
 * Get satellite statistics
 * @param {Array} satellites - Array of satellite objects
 * @returns {Object} Statistics object
 */
export function getSatelliteStats(satellites) {
  const total = satellites.length;
  const active = satellites.filter(s => s.status === 'Active').length;
  const retired = satellites.filter(s => s.status === 'Retired').length;
  const operators = getUniqueOperators(satellites).length;
  
  // Get orbit distribution
  const orbitCounts = {};
  satellites.forEach(sat => {
    if (sat.orbit) {
      orbitCounts[sat.orbit] = (orbitCounts[sat.orbit] || 0) + 1;
    }
  });
  
  // Get type distribution
  const typeCounts = {};
  satellites.forEach(sat => {
    if (sat.type) {
      typeCounts[sat.type] = (typeCounts[sat.type] || 0) + 1;
    }
  });
  
  return {
    total,
    active,
    retired,
    operators,
    orbitCounts,
    typeCounts
  };
}