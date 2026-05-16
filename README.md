# Party Pay

Party Pay is an Android-first executable prototype built with React Native, Expo and TypeScript. It is a local demo of the event ordering flow: customer buys without the cashier line, pays with simulated Pix, receives a pickup QR, and the bartender validates the QR at the counter.

This is not a production payment app. Pix, split, QR validation, operators, finance and order state are simulated in local app state. Supabase is not required to run this prototype.

## Run

```bash
npm install
npx expo start
```

Then press `a` for Android Emulator, or scan the Expo QR with Expo Go on Android.

Alternative:

```bash
npm run android
```

## Demo Roles

- Customer: login, event access, menu, product detail, cart, simulated Pix, approved payment, order status, pickup QR and history.
- Bartender: order queue, order detail, scanner simulation, valid/used/invalid QR states and mark delivered. No finance data is exposed.
- Admin: live dashboard, product availability, add mock product, orders, operators, access code generation and simulated finance/split.

Default language is `pt-BR`. `en-US` strings are included under `src/i18n` and the profile screen toggles locale for demo readiness.

## Visual Direction

The UI follows the supplied Party Pay prototype pack: dark-first nightlife mood, acid yellow, coral, lavender, large rounded poster cards, bold type, glowing QR/ticket surfaces and playful mascots inspired by the original design assets.

## Simulated

- Pix charge and copy/paste code
- Payment approval
- 5% Party Pay commission
- Event payout
- Pickup QR/token generation
- QR validation and used-token blocking
- Product availability and mock creation
- Operator access codes

## Production Work Later

- Supabase Auth, Postgres schema, RLS and Edge Functions
- Real Pix/payment provider integration
- Real scanner/camera implementation
- Push notifications or WhatsApp updates
- Fiscal, refund and settlement integrations
- Production security review
