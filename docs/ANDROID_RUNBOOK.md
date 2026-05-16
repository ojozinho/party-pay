# Android Runbook

1. Install dependencies:

```bash
npm install
```

2. Start Expo:

```bash
npx expo start
```

3. Run on Android:

```bash
npm run android
```

4. Test customer:

- Entrar como cliente
- Entrar na conta demo
- Simular QR encontrado
- Abrir cardapio
- Add product
- Pagar Pix
- Simular Pix aprovado
- Ver QR de retirada

5. Test bartender:

- Entrar como bartender
- Open queue/order
- Mark preparing/ready
- Open scanner
- Scan valid QR
- Scan same QR again to see used-token block

6. Test admin:

- Entrar como admin
- Open dashboard
- Toggle product availability
- Add mock product
- Create bartender access code
- View simulated finance
