# Hosts suportados

[English](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/HOSTS.md) · **Português (BR)**

A lista completa de hosts suportados.

## Hosts

| Host | acelera o timer | usa o cache |
| ---- | :--------: | :--------: |
| adfoc.us | — | — |
| aii.sh | — | — |
| aknewz.xyz | — | — |
| apkadmin.com | — | — |
| avnsgames.com | — | — |
| bit.ly | — | — |
| blog.adlink.click | — | — |
| boost.ink | — | — |
| bst.gg | — | — |
| cety.app | — | — |
| clksz.com | — | ✅ |
| cloud.unblockedgames.world | — | — |
| cloudfam.io | — | — |
| cloudhostt.com | ✅ | — |
| coinclix.co | — | — |
| crm.urlwebsite.com | — | — |
| cutlink.net | — | — |
| cutnet.net | — | — |
| cuttlinks.com | — | — |
| cuttty.com | — | — |
| djxmaza.in | ✅ | — |
| eduify.app | — | — |
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
| gamescrate.app | — | — |
| geekgrove.net | — | — |
| go.fakta.id | — | — |
| gujjukhabar.in | ✅ | — |
| icutlink.com | — | — |
| inshorturl.in | — | — |
| intercelestial.com | — | ✅ |
| invest.datapendidikan.com | — | — |
| jobzhub.store | — | — |
| linegee.net | — | — |
| lnbz.la | — | — |
| loanbixby.com | ✅ | — |
| mahitimanch.in | — | — |
| modsfire.com | ✅ | — |
| nerventualken.com | — | — |
| oii.io | — | — |
| oii.la | — | ✅ |
| ouo.io | ✅ | — |
| ouo.press | ✅ | — |
| pahe.ink | — | — |
| pahe.plus | — | ✅ |
| pdfhindibook.com | ✅ | — |
| rekonise.com | — | — |
| safefileku.com | ✅ | — |
| safelinkearn.com | — | — |
| shrinkme.click | — | — |
| smartfeecalculator.com | ✅ | — |
| speedy-links.com | — | — |
| srnky.com | — | ✅ |
| techbixby.com | ✅ | — |
| textfrog.com | — | — |
| themezon.net | — | — |
| toolkit.inshorturl.com | — | — |
| toolskitpro.net | — | — |
| tpi.li | — | ✅ |
| uiil.ink | — | — |
| upfilesgo.com | — | — |
| uploadrar.com | — | — |
| uploady.io | — | — |
| vexfile.com | — | — |
| www.file-upload.org | — | — |
| www.google.com | — | — |
| www.mirrored.to | — | — |
| www.up-4ever.net | — | — |
| xut.io | — | — |
| zdrive.to | — | — |

- **acelera o timer** — ✅ significa que o script consegue encurtar a contagem do site; — significa que a contagem é validada no servidor e precisa rodar por inteiro.
- **usa o cache** — ✅ significa que os shortlinks desse host usam o cache do worker.

## Hosts finais (destinos)

Quando a sua navegação termina em um destes hosts, o script registra qual shortlink levou até
lá, para a próxima visita ir direto ao destino. `pahe.plus`, `ouo.io` e `ouo.press` também
aparecem na tabela acima: são shortlinks **e** destinos.

| Host | O que é | Observações |
| --- | --- | --- |
| send.now | hospedagem de arquivos | — |
| 1fichier.com | hospedagem de arquivos | — |
| 1024tera.com | nuvem | — |
| gdflix.io / gdflix.dev | hospedagem de download | vale para subdomínios (`www.gdflix.io`), não para o domínio raiz |
| mega.nz | nuvem | — |
| vik1ngfile.site | hospedagem de arquivos | — |
| pahe.plus | indexador de links | também é shortlink (✅ na coluna "usa o cache") |
| filecrypt.cc | contêiner de links | — |
| ouo.io | shortlink | também automatizado pelo próprio template |
| ouo.press | shortlink | também automatizado pelo próprio template |

- Os pares "shortlink → destino" vão para o cache compartilhado; nada mais da visita é enviado.