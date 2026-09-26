import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Fallback products endpoint in case external Firebase RTDB is unreachable
const fallbackProducts = {
  product1: {
    badge: 'BEST SELLER',
    description: 'Premium handcrafted Tulsi Japa Mala made from authentic holy basil wood beads for meditation, chanting, and daily spiritual practice.',
    discount: '45% OFF',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqdy07sNZGDd8AazUZsMitu3g7NIwOC9Cml4xcA1rt2mywDSTNy1OiJChoThjulExOeTkHdiEgOwrUn4p5fH3T--rcZoJJPBp_vjJwXh3Ltws42i3WIIJZgTr4nBfu2TgaJHjfjkL-TYaQR0NbEjLK7w4A_kT29y4l7fh9Fbrg7qhWGc7kk5-4J3sHGYM8nimhWDFvWAm-0JL4Hq3BhnYUDBkDI-7ib40U8dDvU3Wjf1ONiKrRAS9DP63Dmqu6DUqjppRYRZamkCYT',
    name: 'Aurelia Tulsi Japa Mala',
    oldPrice: 899,
    price: 499,
    rating: 4.8,
    reviews: 245
  },
  product2: {
    badge: '',
    description: 'Elegant Tulsi bead wrist band with spiritual charm, designed for comfort, devotion, and positive energy throughout the day.',
    discount: '50% OFF',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmbMQOWUvvh_jR7_M-LWtNycFwoW6YM2Grj8wdN-Z3-n13bZuCDkoWa60SyI1Ui9AH3SO4p7DYLPer8qz3IhBJammTDFoUWcVmx995K8ojJzKG4SM1KyByYWpRh7XkBBdiL3y9g1z0Unowq9vH5ppaOWZ0w3MIa0IAicbfEsjL_FISEYi2T1HbNsyYX9Rp3veJeqbSxkisYkRwWwImgPZRtM59jZLbTTin0eosMxG8kpijW0KpVKmRLr2NSHub9XnvwhoDGzg8iJ9V',
    name: 'Sacred Wrist Band',
    oldPrice: 699,
    price: 349,
    rating: 4.9,
    reviews: 182
  },
  product3: {
    badge: 'NEW',
    description: 'Traditional double-layer Radha-Krishna Kanthi mala crafted from sacred Tulsi wood with a devotional and timeless design.',
    discount: '38% OFF',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcWMfSpDvDk74Dk8rRNQ2Ff1ZXdu3ToH3cb6ddERTN8PGKrdPhRuGsf00SgYr-Evfrv5REJ1OoYYfnTHfH_OzgcN1FZtKKehJzaktKbhOWYzhJyQMrHT1AuHR9SHu7GJImuVaeSnyzVAc2B5jxspuBHkB6znFo08HdJQprGDY-s1wcZCxz9IeRkCcij6czIJoUAh6hNRAXLFPmopsoGwu2pQL8o-NrtNVnVbU4gaAWFu_SLw1RVPA5nnzVPRbc8xv6p9RmKdZTns6O',
    name: 'Radha-Krishna Kanthi',
    oldPrice: 1299,
    price: 799,
    rating: 4.7,
    reviews: 96
  },
  product4: {
    badge: '',
    description: 'Hand-strung Brahmand Japa Mala featuring smooth Tulsi beads ideal for mantra chanting, meditation, and spiritual gifting.',
    discount: '45% OFF',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAo2qBwosPUI2G7y8cD4oMdqf_pH4XpLvUx7JmoGwWINNS30mwlwlhxsVWYQR_j_yVKkg0a-U1N5ZStjiCy3vgCEud8kse58GHViaHwdUfvJbr8vyzuI2lS-z_ZVBRNfVRybvw8gdphAY4C_qnXCBreMP8YLzbklHz87Z1YgNU_KbwRn4NeS9RHPRv3ifix4R6A1b-mAeeb7N1w1h7KUu4JPu0V8C2aUC7D7gEcVkOQN416ThunLfuyDm7UUb7sUBJaNh-yWVqWUeB',
    name: 'Brahmand Japa Mala',
    oldPrice: 999,
    price: 549,
    rating: 4.8,
    reviews: 312
  }
};

app.get('/api/products', (req, res) => {
  res.json(fallbackProducts);
});

// Provide config to client if customized via env
app.get('/api/config', (req, res) => {
  res.json({
    firebaseConfig: {
      apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCpt_9Z6-velDivDI0PxWDfakGeUdMPjKM",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "tulsi-mala.firebaseapp.com",
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://tulsi-mala-default-rtdb.firebaseio.com",
      projectId: process.env.FIREBASE_PROJECT_ID || "tulsi-mala",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "tulsi-mala.appspot.com",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "963239580602",
      appId: process.env.FIREBASE_APP_ID || "1:963239580602:web:d70b2b6981118645484383"
    }
  });
});

// In-memory order collection if client posts to local server
const inMemoryOrders = [];
app.post('/api/orders', (req, res) => {
  const order = { id: `order_${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  inMemoryOrders.push(order);
  res.status(201).json({ success: true, orderId: order.id });
});

// Serve static assets and index.html
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tulsi Mala Website server running on http://0.0.0.0:${PORT}`);
});
