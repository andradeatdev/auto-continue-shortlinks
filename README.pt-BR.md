# Pahe - Auto Continue Links

[English](README.md) · **Português (BR)**

[![Instalar no Greasy Fork](https://img.shields.io/badge/Instalar-Greasy_Fork-670000?style=flat-square)](https://greasyfork.org/scripts/593212)
[![Versão no Greasy Fork](https://img.shields.io/greasyfork/v/593212?style=flat-square&label=vers%C3%A3o)](https://greasyfork.org/scripts/593212)
[![Instalações no Greasy Fork](https://img.shields.io/greasyfork/dt/593212?style=flat-square&label=instala%C3%A7%C3%B5es)](https://greasyfork.org/scripts/593212)
[![Feedbacks no Greasy Fork](https://img.shields.io/greasyfork/rating-count/593212?style=flat-square&label=rating)](https://greasyfork.org/scripts/593212)
[![Licença](https://img.shields.io/github/license/andradeatdev/auto-continue-shortlinks?style=flat-square&logo=gnu)](LICENSE)
[![Hosts suportados](https://img.shields.io/badge/hosts-78%20suportados-2EA44F?style=flat-square)](HOSTS.md)

## Índice

- [Pahe - Auto Continue Links](#pahe---auto-continue-links)
- [Hosts suportados](#hosts-suportados)
- [Cache de bypass](#cache-de-bypass)
- [Aceleração de timer](#aceleração-de-timer)
- [Privacidade](#privacidade)
- [Menu do script](#menu-do-script)
- [Limitações](#limitações)
- [Solução de problemas](#solução-de-problemas)
- [Reportar problemas / Pedir novo host](#reportar-problemas--pedir-novo-host)
- [Licença](#licença)

---

Este userscript automatiza shortlinks no pahe.ink e em outros sites que usam os mesmos hosts. Funciona com [Violentmonkey](https://violentmonkey.github.io/) e Tampermonkey, e mais hosts serão adicionados com o tempo.

## Hosts suportados

Veja o [HOSTS.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/HOSTS.md) para a lista completa de hosts suportados.

## Cache de bypass

O script usa um Cloudflare Worker (`https://shortlinks.zencore.fun`) como cache compartilhado. Quando um shortlink já foi burlado por outro usuário, você vai direto para a URL final.

- **Leitura:** ao abrir um shortlink suportado (`tpi.li`, `oii.la`, `intercelestial.com`, `pahe.plus`), o script pergunta ao Worker se o destino final já é conhecido. Se for, navega direto para ele e pula o timer.
- **Escrita:** quando sua navegação chega a um host final de arquivos (`send.now`, `mega.nz`, ...), o script envia ao Worker o shortlink visitado e o destino alcançado, para que visitas futuras ao mesmo shortlink vão direto ao destino.

## Aceleração de timer

Sempre que possível, o script acelera o timer de espera nas páginas de shortlink.

Alguns hosts validam o timer no servidor. Nesses sites o timer **não pode ser acelerado**: o script ainda pode automatizar outras etapas (cliques, remoção de elementos desnecessários), mas o timer precisa correr pelo tempo completo. Os hosts marcados com `tuner-timer` no [HOSTS.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/HOSTS.md) são os que se enquadram nesse caso.

## Privacidade

Os únicos dados compartilhados com o Worker (veja [Cache de bypass](#cache-de-bypass)) são:

- A URL do shortlink que você está visitando.
- A URL de destino que sua navegação alcançou.

Nenhum outro dado é enviado. Para desativar, desligue **Use cache** no [menu do script](#menu-do-script), globalmente ou apenas para um domínio.

## Menu do script

Se o seu gerenciador de userscripts suportar comandos de menu, as seguintes opções ficam disponíveis:

| Comando | O que faz | Padrão |
|---|---|---|
| **Use cache** | Liga/desliga o [cache de bypass](#cache-de-bypass). Tem substituição por domínio (`This domain`). | Ligado |
| **Use continue** | Liga/desliga a automação de continuar/clicar nos links. Tem substituição por domínio (`This domain`). | Ligado |
| **Use patcher** | Liga/desliga as correções e acelerações do patcher. Tem substituição por domínio (`This domain`). | Ligado |
| **▶ Report URL issue** | Abre o formulário **site broken** do GitHub em uma nova aba. | – |
| **▶ Support a new shortlink/host** | Abre o formulário **site request** do GitHub em uma nova aba. | – |

Os três toggles mostram o estado com um ícone: **✔** ativo, **✘** desligado, **–** desativado globalmente. Clicar em um toggle altera o estado e recarrega a página atual. Os dois comandos **▶** apenas abrem um formulário: não têm estado e não recarregam a página.

## Limitações

- Este script **não resolve CAPTCHAs**. Ele apenas automatiza cliques, remove elementos desnecessários e realiza outras ações simples. **Você ainda precisa resolver o CAPTCHA manualmente.** Veja o [CAPTCHAS.pt-BR.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/CAPTCHAS.pt-BR.md), incluindo como usar o cookie de acessibilidade do hCaptcha.
- Alguns sites validam o timer no servidor e **não podem ser acelerados** (veja [Aceleração de timer](#aceleração-de-timer)).
- O pahe.ink às vezes adiciona novos domínios, então o script pode não funcionar em sites muito novos. Você pode tentar adicioná-los manualmente ou aguardar a próxima atualização.
- Recomenda-se usar um bloqueador de anúncios, como uBlock Origin ou AdGuard.

## Solução de problemas

Os problemas mais comuns e suas soluções (script sem efeito, CAPTCHAs, timers, cache e questões específicas de hosts, como o intercelestial.com) estão no [TROUBLESHOOTING.pt-BR.md](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/TROUBLESHOOTING.pt-BR.md).

## Reportar problemas / Pedir novo host

- **Um site parou de funcionar:** use o comando **Report URL issue** no menu do script, ou abra o formulário [Site stopped working](https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?template=site-broken.yml).
- **Um novo site deveria ser suportado:** abra uma issue [Support a new site](https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?template=site-request.yml).

## Licença

**GPL-3.0** — © 2024-2026 hdyzen (andradeatdev). Se você copiar, modificar ou redistribuir este script, deve manter o aviso de copyright e o código-fonte sob a GPL-3.0. Veja [LICENSE](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/LICENSE).