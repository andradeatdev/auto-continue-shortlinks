# Supported Hosts

**English** · [Português (BR)](HOSTS.pt-BR.md)

The complete list of supported hosts.

## Hosts

| Host | speeds up the timer | uses the cache |
| ---- | :--------: | :--------: |
| aii.sh | — | — |
| aknewz.xyz | — | — |
| apkadmin.com | — | — |
| avnsgames.com | — | — |
| boost.ink | — | — |
| bst.gg | — | — |
| cety.app | — | — |
| clksz.com | — | ✅ |
| cloud.unblockedgames.world | — | — |
| cloudfam.io | — | — |
| cloudhostt.com | ✅ | — |
| cutlink.net | — | — |
| cutnet.net | — | — |
| cuttlinks.com | — | — |
| cuttty.com | — | — |
| djxmaza.in | ✅ | — |
| en.mrproblogger.com | — | ✅ |
| exe-links.com | — | — |
| exe-urls.com | — | — |
| exego.app | — | — |
| exeygo.com | — | — |
| exnion.com | — | — |
| fc-lc.xyz | — | — |
| filespayouts.com | ✅ | — |
| financeehelp.com | ✅ | — |
| financeguidz.com | ✅ | — |
| gujjukhabar.in | ✅ | — |
| icutlink.com | — | — |
| intercelestial.com | — | ✅ |
| jobzhub.store | — | — |
| linegee.net | — | — |
| lnbz.la | — | — |
| loanbixby.com | ✅ | — |
| modsfire.com | ✅ | — |
| oii.io | — | — |
| oii.la | — | ✅ |
| ouo.io | ✅ | — |
| ouo.press | ✅ | — |
| pahe.plus | — | ✅ |
| pdfhindibook.com | ✅ | — |
| rekonise.com | — | — |
| safefileku.com | ✅ | — |
| shrinkme.click | — | — |
| smartfeecalculator.com | ✅ | — |
| srnky.com | — | ✅ |
| techbixby.com | ✅ | — |
| tpi.li | — | ✅ |
| themezon.net | — | — |
| toolskitpro.net | — | — |
| uiil.ink | — | — |
| upfilesgo.com | — | — |
| uploadrar.com | — | — |
| uploady.io | — | — |
| vexfile.com | — | — |
| www.file-upload.org | — | — |
| www.up-4ever.net | — | — |
| zdrive.to | — | — |

- **speeds up the timer** — ✅ means the script can shorten that site's countdown; — means the countdown is validated server-side and has to run in full.
- **uses the cache** — ✅ means shortlinks from that host use the worker cache.

## Final hosts (destinations)

When your navigation ends on one of these hosts, the script records which shortlink led there,
so the next visit goes straight to the destination. `pahe.plus`, `ouo.io` and `ouo.press` also
appear in the table above — they are shortlinks **and** destinations.

| Host | What it is | Notes |
| --- | --- | --- |
| send.now | file host | — |
| 1fichier.com | file host | — |
| 1024tera.com | cloud storage | — |
| gdflix.io / gdflix.dev | download host | covers subdomains (`www.gdflix.io`), not the bare domain |
| mega.nz | cloud storage | — |
| vik1ngfile.site | file host | — |
| pahe.plus | link index | also a shortlink ("uses the cache" ✅ above) |
| filecrypt.cc | link container | — |
| ouo.io | shortlink | also automated by its own template |
| ouo.press | shortlink | also automated by its own template |

- The "shortlink → destination" pairs go to the shared worker cache; nothing else about the
  visit is sent.