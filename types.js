/**
 * @typedef {{ type: "notificationsEnabled" }} NotificationsEnabledMessage
 * @typedef {{ type: "notificationsDisabled" }} NotificationsDisabledMessage
 * @typedef {{ type: "countsChanged", counts: Map<string, number> }} CountsChangedMessage
 * @typedef {NotificationsEnabledMessage | NotificationsDisabledMessage | CountsChangedMessage} NotificationMessage
 */

export const Types = {};