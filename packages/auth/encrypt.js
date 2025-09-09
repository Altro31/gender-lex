import * as crypto from "node:crypto"

const ALGORITHM = 'aes-256-gcm'

export function encrypt(text, key) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final(),
    ])
    const authTag = cipher.getAuthTag()

    return Buffer.concat([iv, authTag, encrypted]).toString('base64')
}

export function decrypt(encryptedBase64, key) {
    const data = Buffer.from(encryptedBase64, 'base64')

    const iv = data.subarray(0, 16)
    const authTag = data.subarray(16, 32)
    const encryptedText = data.subarray(32)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    const decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
    ])
    return decrypted.toString('utf8')
}