# Pahe - Auto Continue Links

**Português (BR)** · [English](README.md)

[![Instalar no Greasy Fork](https://img.shields.io/badge/Instalar-Greasy_Fork-670000?style=flat-square)](https://greasyfork.org/scripts/593212)
[![Licença](https://img.shields.io/github/license/andradeatdev/auto-continue-shortlinks?style=flat-square&logo=gnu)](LICENSE)
[![Versão](https://img.shields.io/greasyfork/v/593212?style=flat-square&label=vers%C3%A3o)](https://greasyfork.org/scripts/593212)
[![Instalações](https://img.shields.io/greasyfork/dt/593212?style=flat-square&label=instala%C3%A7%C3%B5es)](https://greasyfork.org/scripts/593212)
[![Avaliação](https://img.shields.io/greasyfork/rating-count/593212?style=flat-square&label=avalia%C3%A7%C3%A3o)](https://greasyfork.org/scripts/593212)
[![Gerenciadores](https://img.shields.io/badge/gerenciadores-Violentmonkey%20%7C%20Tampermonkey-00485B?style=flat-square)](https://violentmonkey.github.io/)
[![Hosts suportados](https://img.shields.io/badge/hosts-49%20suportados-2EA44F?style=flat-square)](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/HOSTS.md)

Este script automatiza shortlinks no pahe.ink e em outros sites que usam os mesmos hosts. Mais hosts serão adicionados com o tempo.

#### Cache de Bypass Instantâneo

O script usa um Cloudflare Worker (`https://shortlinks.fdyzen.workers.dev`) como cache compartilhado, para que o bypass vá direto para a URL final quando o shortlink já foi resolvido por outros usuários:

- Quando você abre um shortlink suportado (`tpi.li`, `oii.la`, `intercelestial.com`, `pahe.plus`), o script pergunta ao Worker se o destino final daquele shortlink já é conhecido. Se sim, navega direto para lá, pulando o timer/espera.
- Quando a sua navegação chega a um host de arquivos final (`send.now`, `mega.nz`, ...), o script envia a URL do shortlink visitado e a URL de destino alcançada para o Worker, para que as visitas de outros usuários ao mesmo shortlink vão direto ao destino.

Para isso funcionar, os seguintes dados são compartilhados com o Worker:

- A URL do shortlink que você está visitando.
- A URL de destino que a sua navegação alcançou.

Esses dados ficam armazenados no Cloudflare KV, são usados apenas para devolver o destino salvo em visitas futuras (suas e de outros usuários) e **não** são compartilhados com terceiros. O recurso pode ser desativado editando `CONFIG.WORKER_URL` (deixe vazio) no script.

#### Hosts Suportados

Veja [HOSTS.md](HOSTS.md) para a lista completa de hosts suportados.

#### Aceleração de Timer

Alguns hosts fazem validação de timer no lado do servidor. Nesses sites, o timer **não pode ser acelerado** pelo script — veja [HOSTS.md](HOSTS.md) para detalhes.

O script ainda consegue automatizar outras partes do processo nesses sites, mas o timer precisa rodar pelo tempo exigido.

#### Notas

> O Intercelestial.com atualiza o código de detecção com frequência. Recomendo procurar outras formas de encontrar o filme/série que você procura, já que só consigo corrigir quando tenho tempo.

- **Recomendo usar um bloqueador de anúncios, como uBlock Origin ou Adguard.**
- Este script **não** resolve **CAPTCHAs**. Ele só automatiza cliques, remove elementos desnecessários e faz outras ações simples quando possível. **Você ainda precisa resolver o CAPTCHA manualmente**.
- Alguns sites **não podem ter o timer acelerado** — a validação do timer é feita no servidor; para ver quais sites têm `tuner-timer`, consulte [HOSTS.md](HOSTS.md).
- O pahe.ink adiciona novos domínios às vezes, então o script pode não funcionar em alguns sites novos — você pode tentar **adicioná-los manualmente ou esperar a próxima atualização**.
- O Interestial.com retorna "sessão inválida" se você abrir múltiplas abas, **esse problema não é relacionado a este script**.
