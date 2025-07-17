export const InvitationStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type InvitationStatus = keyof typeof InvitationStatus; 
