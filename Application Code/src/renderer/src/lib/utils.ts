import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a large number into a human-readable string with appropriate units (K, M, B, T).
 * @param {number} num The number to format.
 * @returns {string} Formatted number with appropriate units.
 */
export function formatLargeNumber(num: number): string {
  const units = [' K', ' M', ' B', ' T']
  let formattedNumber = num.toString()

  // Determine the appropriate unit
  let unitIndex = 0
  while (Math.abs(num) >= 1000 && unitIndex < units.length - 1) {
    num /= 1000
    unitIndex++
  }

  // Format the number with the appropriate unit
  formattedNumber = num.toLocaleString(undefined, { maximumFractionDigits: 2 }) + units[unitIndex]

  return formattedNumber
}

/**
 * Formats the input date string into 'YYYY-MM-DD' format.
 * @param {string} inputDate The input date string to format.
 * @returns {string} Formatted date string in 'YYYY-MM-DD' format.
 */
export function formatDate(inputDate: string): string {
  const date = new Date(inputDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Returns the current time in 12-hour format with AM/PM.
 * Example output: "08:30 AM", "01:45 PM".
 * @returns {string} Current time formatted as "HH:MM AM/PM".
 */
export function getCurrentTimeString() {
  const currentDate = new Date()
  let hours = currentDate.getHours()
  const minutes = currentDate.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // Handle midnight (0 hours)
  const formattedHours = hours < 10 ? '0' + hours : hours
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
  return formattedHours + ':' + formattedMinutes + ' ' + ampm
}

/**
 * Generates a unique ID string.
 * The unique ID is created by combining the current timestamp and a random number,
 * both converted to base-36 to ensure a compact representation.
 *
 * @returns {string} A unique ID string.
 */
export function generateUniqueId(): string {
  const timestamp = Date.now().toString(36) // Convert the current timestamp to a base-36 string
  const randomNum = Math.random().toString(36).substr(2, 9) // Generate a random base-36 string
  return `${timestamp}-${randomNum}`
}

/**
 * Parses a file path and extracts the file name and its extension.
 *
 * @param {string} filePath - The complete file path string.
 * @returns {object} An object containing the file name and its extension.
 */
export function parseFilePath(filePath: string) {
  const parts = filePath.split('\\')
  const name = parts[parts.length - 1]
  const extension = name.split('.')[1]
  const fileName = name.split('.')[0]

  return {
    fileName,
    extension
  }
}
