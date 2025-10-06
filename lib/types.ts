export interface VaultItem {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EncryptedVaultItem {
  id: string;
  titleEncrypted: string;
  usernameEncrypted: string;
  passwordEncrypted: string;
  urlEncrypted: string;
  notesEncrypted: string;
  iv: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
}
