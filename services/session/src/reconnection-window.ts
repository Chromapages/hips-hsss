export type ReconnectionTicket = {
  sessionId: string;
  anonymousParticipantId: string;
  reconnectUntil: Date;
};

export function canReconnect(ticket: ReconnectionTicket, now = new Date()) {
  return ticket.reconnectUntil > now;
}
