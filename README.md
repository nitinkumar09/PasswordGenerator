# Secure Vault - Password Manager

A privacy-first password manager with client-side encryption. Generate strong passwords and store them securely with zero-knowledge architecture.

## Features

- **Password Generator**: Create strong passwords with customizable options (length, character sets, exclude similar characters)
- **Secure Vault**: Store passwords, usernames, URLs, and notes with client-side encryption
- **Zero-Knowledge Architecture**: Server never sees plaintext data
- **Search & Filter**: Quickly find vault items
- **Auto-Clear Clipboard**: Copied passwords automatically clear after 15 seconds
- **Responsive UI**: Clean, modern interface that works on all devices

## Encryption Implementation

### How It Works

This application uses **client-side encryption** to ensure your data is secure:

- **Algorithm**: AES-GCM (256-bit) for encryption/decryption
- **Key Derivation**: PBKDF2 with SHA-256 (100,000 iterations)
- **Library**: Web Crypto API (native browser implementation)

All vault items are encrypted in the browser before being stored. The encryption key is derived from your master password, which never leaves your device. Each item uses unique salt and initialization vector (IV) values for maximum security.

### Why This Approach?

- **Web Crypto API** is built into modern browsers, audited, and maintained by browser vendors
- **Zero external crypto dependencies** reduces attack surface
- **PBKDF2** with 100k iterations provides strong protection against brute-force attacks
- **AES-GCM** provides both confidentiality and authenticity

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

No environment variables required for local development. The app uses localStorage for demonstration purposes.

For production with Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing Acceptance Criteria

### Manual Test Flow

1. **Sign Up**
   - Click "Sign Up" tab
   - Enter email and a strong master password
   - Confirm password and create account

2. **Generate Password**
   - Click "Add New Item" (+) button
   - Switch to "Password Generator" tab
   - Adjust length and character options
   - Click "Use This Password" to apply

3. **Save Vault Item**
   - Fill in title (required) and password (required)
   - Optional: username, URL, notes
   - Click "Save"
   - Verify item appears in list

4. **Search & Filter**
   - Enter text in search box
   - Items filter by title, username, or URL

5. **Copy to Clipboard**
   - Select an item
   - Click copy icon next to password
   - Password copies and auto-clears after 15 seconds

6. **Edit & Delete**
   - Click edit icon to modify item
   - Click delete icon and confirm to remove

7. **Verify Encryption**
   - Open browser DevTools > Application > Local Storage
   - Inspect `vault_items` key
   - Verify all data is ciphertext (base64-encoded strings)
   - No plaintext passwords, usernames, or titles visible

### Demo Credentials

For testing, you can create any account:
- Email: `demo@example.com`
- Password: `SecurePassword123!`

## Project Structure

```
/app
  layout.tsx          # Root layout with providers
  page.tsx            # Main vault application
  globals.css         # Global styles

/components
  auth-form.tsx       # Login/signup UI
  password-generator.tsx  # Password generation with strength meter
  vault-item-form.tsx     # Add/edit vault item modal
  vault-list.tsx          # Vault items list and detail view
  /ui                     # shadcn/ui components

/lib
  auth-context.tsx    # Authentication state management
  crypto.ts           # Encryption/decryption utilities (Web Crypto API)
  password-generator.ts   # Password generation logic
  types.ts            # TypeScript interfaces
  vault-storage.ts    # Vault CRUD operations
  utils.ts            # Utility functions
```

## Security Notes

### Implemented Security Measures

- **Client-side encryption**: All vault data encrypted before storage
- **PBKDF2 key derivation**: 100,000 iterations for strong password hashing
- **Unique salts and IVs**: Each item uses unique cryptographic parameters
- **Auto-clear clipboard**: Passwords auto-clear after 15 seconds
- **No secrets in logs**: No passwords or keys logged to console in production

### Production Recommendations

For production deployment:

1. **Use HTTPS**: All connections must be encrypted in transit
2. **Implement rate limiting**: Protect auth endpoints from brute-force
3. **Add 2FA**: Consider TOTP-based two-factor authentication
4. **Session management**: Use secure, HTTP-only cookies
5. **Regular security audits**: Keep dependencies updated
6. **Backup strategy**: Allow encrypted exports for data recovery

## Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy with Supabase Backend

1. Create Supabase project
2. Run migration from `.env.example`
3. Add environment variables to deployment
4. Deploy to Vercel/Netlify

## Development

```bash
npm run dev         # Start development server
npm run build       # Create production build
npm run lint        # Run ESLint
npm run typecheck   # Check TypeScript types
```

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
