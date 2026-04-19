/**
 * Hatırlatıcı CRUD için paylaşılan veri şekilleri (JSDoc).
 * TypeScript kullanılmadığında editör yardımı ve ödev klasör yapısı için.
 *
 * @typedef {'medicine' | 'food' | 'appointment' | 'water' | 'custom'} TitleType
 * @typedef {'daily' | 'weekly' | 'monthly'} RecurrenceType
 * @typedef {'kitchen' | 'bathroom' | 'bedroom'} LocationId
 * @typedef {'red' | 'green'} Urgency
 * @typedef {'daily' | 'weekly' | 'monthly' | 'yearly'} ReminderBucketKey
 *
 * @typedef {Object} ReminderFormFields
 * @property {string} title
 * @property {TitleType | string} titleType
 * @property {string} description
 * @property {boolean} isRecurring
 * @property {RecurrenceType | string} recurrenceType
 * @property {number} recurrenceCount
 * @property {string} date
 * @property {string} time
 * @property {string | null} photo
 * @property {string} personName
 * @property {string} personPhone
 * @property {string} personEmail
 * @property {LocationId | string} location
 * @property {Urgency} urgency
 *
 * @typedef {ReminderFormFields & { id: number, createdAt: string }} Reminder
 *
 * @typedef {Object} RemindersByBucket
 * @property {Reminder[]} daily
 * @property {Reminder[]} weekly
 * @property {Reminder[]} monthly
 * @property {Reminder[]} yearly
 */

export {};
