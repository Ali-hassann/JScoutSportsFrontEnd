import { Injectable } from '@angular/core';
// import * as Crypto from 'crypto-js';

@Injectable({
    providedIn: 'root'
})

export class EncryptDecryptService {

    constructor() { }

    // The set method is use for encrypt the value.
    encrypt(str: string) {
        // const key = Crypto.enc.Utf8.parse(SALTS.key.toString());
        // const iv = Crypto.enc.Utf8.parse(SALTS.key.toString());
        // const encrypted = Crypto.AES.encrypt(Crypto.enc.Utf8.parse(str.toString()), key,
        //   {
        //     keySize: 128 / 8,
        //     iv: iv,
        //     mode: Crypto.mode.CBC,
        //     padding: Crypto.pad.Pkcs7
        //   });

        return str;

        // const encrypted = Crypto.AES.encrypt(str, SALTS.key.toString()).toString();
        // return encrypted;
    }

    // The get method is use for decrypt the value.
    decrypt(str) {
        // const key = Crypto.enc.Utf8.parse(SALTS.key.toString());
        // const iv = Crypto.enc.Utf8.parse(SALTS.key.toString());
        // const decrypted = Crypto.AES.decrypt(str, key, {
        //   keySize: 128 / 8,
        //   iv: iv,
        //   mode: Crypto.mode.CBC,
        //   padding: Crypto.pad.Pkcs7
        // });

        // return decrypted.toString(Crypto.enc.Utf8);
        return str;
    }
}
