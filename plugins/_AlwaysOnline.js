export async function before(m) {
  const presenceStatus = 'recording';
  await this.sendPresenceUpdate(presenceStatus, m.chat);
}

export const disabled = false;
