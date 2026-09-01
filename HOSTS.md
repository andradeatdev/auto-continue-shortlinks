# Supported Hosts

The full list of hosts supported by the script.

## Hosts

| Host | tune-timer |
| ---- | :--------: |
| adfoc.us | — |
| djxmaza.in | — |
| filespayouts.com | ✅ |
| intercelestial.com | ✅ |
| modsfire.com | — |
| oii.la | — |
| ouo.io | — |
| ouo.press | — |
| pahe.plus | — |
| safefileku.com | ✅ |
| selfhostt.com | — |
| ssdhostting.com | — |
| tpi.li | — |
| upfilesgo.com | — |
| vexfile.com | — |
| www.file-upload.org | — |

- **tune-timer** — the host's rules use the `tune-timer` patch to accelerate timers. See [RULES.md](RULES.md) for the patch grammar.

## Hosts that must NOT be accelerated

The following hosts perform server-side timer validation and **cannot** have their timers accelerated:

- tpi.li
- oii.la
- pahe.plus
