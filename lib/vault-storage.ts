import { VaultItem, EncryptedVaultItem } from './types';
import { encryptData, decryptData } from './crypto';

const VAULT_STORAGE_KEY = 'vault_items';

export async function saveVaultItem(
  item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string,
  masterPassword: string
): Promise<VaultItem> {
  const items = getStoredItems(userId);

  const titleEnc = await encryptData(item.title, masterPassword);
  const usernameEnc = await encryptData(item.username, masterPassword);
  const passwordEnc = await encryptData(item.password, masterPassword);
  const urlEnc = await encryptData(item.url, masterPassword);
  const notesEnc = await encryptData(item.notes, masterPassword);

  const now = new Date().toISOString();
  const newItem: EncryptedVaultItem = {
    id: crypto.randomUUID(),
    titleEncrypted: titleEnc.ciphertext,
    usernameEncrypted: usernameEnc.ciphertext,
    passwordEncrypted: passwordEnc.ciphertext,
    urlEncrypted: urlEnc.ciphertext,
    notesEncrypted: notesEnc.ciphertext,
    iv: titleEnc.iv,
    salt: titleEnc.salt,
    createdAt: now,
    updatedAt: now,
  };

  items.push(newItem);
  storeItems(userId, items);

  return {
    id: newItem.id,
    title: item.title,
    username: item.username,
    password: item.password,
    url: item.url,
    notes: item.notes,
    createdAt: newItem.createdAt,
    updatedAt: newItem.updatedAt,
  };
}

export async function updateVaultItem(
  id: string,
  updates: Partial<Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>>,
  userId: string,
  masterPassword: string
): Promise<VaultItem> {
  const items = getStoredItems(userId);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error('Item not found');
  }

  const existing = items[index];
  const decrypted = await decryptVaultItem(existing, masterPassword);

  const updated = { ...decrypted, ...updates };

  const titleEnc = await encryptData(updated.title, masterPassword);
  const usernameEnc = await encryptData(updated.username, masterPassword);
  const passwordEnc = await encryptData(updated.password, masterPassword);
  const urlEnc = await encryptData(updated.url, masterPassword);
  const notesEnc = await encryptData(updated.notes, masterPassword);

  items[index] = {
    ...existing,
    titleEncrypted: titleEnc.ciphertext,
    usernameEncrypted: usernameEnc.ciphertext,
    passwordEncrypted: passwordEnc.ciphertext,
    urlEncrypted: urlEnc.ciphertext,
    notesEncrypted: notesEnc.ciphertext,
    iv: titleEnc.iv,
    salt: titleEnc.salt,
    updatedAt: new Date().toISOString(),
  };

  storeItems(userId, items);

  return {
    ...updated,
    id,
    createdAt: existing.createdAt,
    updatedAt: items[index].updatedAt,
  };
}

export function deleteVaultItem(id: string, userId: string): void {
  const items = getStoredItems(userId);
  const filtered = items.filter((item) => item.id !== id);
  storeItems(userId, filtered);
}

export async function getVaultItems(
  userId: string,
  masterPassword: string
): Promise<VaultItem[]> {
  const items = getStoredItems(userId);
  const decrypted = await Promise.all(
    items.map((item) => decryptVaultItem(item, masterPassword))
  );
  return decrypted;
}

async function decryptVaultItem(
  item: EncryptedVaultItem,
  masterPassword: string
): Promise<VaultItem> {
  const title = await decryptData(
    { ciphertext: item.titleEncrypted, iv: item.iv, salt: item.salt },
    masterPassword
  );
  const username = await decryptData(
    { ciphertext: item.usernameEncrypted, iv: item.iv, salt: item.salt },
    masterPassword
  );
  const password = await decryptData(
    { ciphertext: item.passwordEncrypted, iv: item.iv, salt: item.salt },
    masterPassword
  );
  const url = await decryptData(
    { ciphertext: item.urlEncrypted, iv: item.iv, salt: item.salt },
    masterPassword
  );
  const notes = await decryptData(
    { ciphertext: item.notesEncrypted, iv: item.iv, salt: item.salt },
    masterPassword
  );

  return {
    id: item.id,
    title,
    username,
    password,
    url,
    notes,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function getStoredItems(userId: string): EncryptedVaultItem[] {
  const allItems = JSON.parse(localStorage.getItem(VAULT_STORAGE_KEY) || '{}');
  return allItems[userId] || [];
}

function storeItems(userId: string, items: EncryptedVaultItem[]): void {
  const allItems = JSON.parse(localStorage.getItem(VAULT_STORAGE_KEY) || '{}');
  allItems[userId] = items;
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(allItems));
}
