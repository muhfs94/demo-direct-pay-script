export function generateUniqueId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const timestamp = Date.now().toString(36); // Convert timestamp to a base-36 string

  // Generate random characters
  for (let i = 0; i < length - timestamp.length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  // Append the timestamp to ensure uniqueness
  return result + timestamp;
}
