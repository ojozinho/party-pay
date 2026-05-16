# Supabase Prep

Supabase is optional for this executable prototype.

## Safe keys

Client/mobile apps may use public/anon/publishable keys only when Row Level Security is correctly enabled.

## Never expose

Never expose these in client code:

- service_role key;
- database password;
- JWT secret;
- private admin credentials.

## Files

Commit:

```txt
.env.example
```

Do not commit:

```txt
.env
.env.local
.env.*.local
```

## Future production modules

- Auth;
- profiles;
- organizations;
- organization_members;
- events;
- products;
- orders;
- payments;
- payment_splits;
- pickup_tokens;
- audit_logs;
- webhook_events;
