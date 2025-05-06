import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

var serviceAccount = require('src/services/firebase/config/objects-transmitter-backend-firebase-adminsdk-fbsvc-ca00729a4a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: '<your-project-id>.appspot.com',
});