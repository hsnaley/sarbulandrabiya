# Sarbuland & Rabiya Wedding Invitation

An interactive fan-concept wedding invitation inspired by the visual world and characters of HUM TV's *Zanjeerain*.

Live site: https://hsnaley.github.io/sarbulandrabiya/

## Local preview

```bash
npm run dev
```

The normal URL opens with the sealed invitation gate. Useful preview parameters:

- `?guest=Khan%20Family` personalizes the inner invitation card.
- `?open=1` skips the envelope for development and marketing captures.
- `?open=1&section=story-chapters` requests a direct section preview.

## Assets

Optimized web artwork is stored in `public/assets/zanjeerain`. Original-resolution and legacy assets are preserved in `source-assets` and are not included in the deployed site.

## Confirmation

Copy `.env.example` to `.env` when configuring a real invitation. `VITE_RSVP_WEBHOOK_URL` receives the JSON confirmation; `VITE_WHATSAPP_NUMBER` supplies the host fallback in international format without a leading `+`.

This is an unofficial fan concept and is not affiliated with HUM TV or the performers.
