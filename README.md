# deptoday

deno dependencies checker

supported:

- `jsr` specifier.
- `npm` specifier.
- `https://deno.land` domain.

## Usage

```bash
deno run --allow-read --allow-net --allow-env scripts/check.ts .
```

```bash
deno run --allow-env --allow-read --allow-net https://raw.githubusercontent.com/lisez/deptoday/main/scripts/check.ts .
```

### Examples

```bash
> deno run -A scripts/check.ts .

┌─────────────┬──────────┬───────────┬───────────┐
│ (idx)       │ Provider │ Version   │ Latest    │
├─────────────┼──────────┼───────────┼───────────┤
│ @std/assert │ "jsr"    │ "0.224.0" │ "0.225.3" │
│ @std/async  │ "jsr"    │ "0.224.0" │ "0.224.1" │
│ @std/fs     │ "jsr"    │ "0.224.0" │ "0.229.1" │
│ @std/path   │ "jsr"    │ "0.224.0" │ "0.225.1" │
└─────────────┴──────────┴───────────┴───────────┘
```
