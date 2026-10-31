# Solução de problemas

[English](TROUBLESHOOTING.md) · **Português (BR)**

## Índice

- [O script não faz nada na página](#o-script-não-faz-nada-na-página)
- [Aparece um CAPTCHA](#aparece-um-captcha)
- [O timer não é acelerado](#o-timer-não-é-acelerado)
- [Um novo domínio do pahe.ink não funciona](#um-novo-domínio-do-paheink-não-funciona)
- [O cache me leva a um destino errado ou quebrado](#o-cache-me-leva-a-um-destino-errado-ou-quebrado)
- [intercelestial.com](#intercelestialcom)
- [Ainda não funciona?](#ainda-não-funciona)

## O script não faz nada na página

1. Confirme que o script está ativado no seu gerenciador de userscripts ([Violentmonkey](https://violentmonkey.github.io/) ou Tampermonkey).
2. Abra o menu do script e verifique se **Use continue** e **Use patcher** estão ativos (✔), tanto globalmente quanto em **This domain**. Veja o [menu do script](README.pt-BR.md#menu-do-script).
3. Confira se o host está na lista de [hosts suportados](/docs/HOSTS.md).
4. Se você usa um bloqueador de anúncios ou extensão de privacidade, tente desativá-lo nessa página para ver se está interferindo.

## Aparece um CAPTCHA

O script **não resolve CAPTCHAs**: você precisa resolvê-los manualmente. No caso do hCaptcha, dá para reduzir a frequência com o cookie de acessibilidade. Veja o [CAPTCHAS.pt-BR.md](/docs/CAPTCHAS.pt-BR.md).

## O timer não é acelerado

Alguns hosts validam o timer no servidor, então ele **não pode ser acelerado**. O script ainda automatiza as outras etapas, mas o timer precisa correr pelo tempo completo. Os hosts marcados com `tuner-timer` no [HOSTS.md](/docs/HOSTS.md) são os que se enquadram nesse caso.

## Um novo domínio do pahe.ink não funciona

O pahe.ink às vezes adiciona novos domínios, então o script pode não funcionar em sites muito novos. Você pode tentar adicionar o domínio manualmente no seu gerenciador de userscripts ou aguardar a próxima atualização. Se o host ainda não for suportado, [peça o suporte](README.pt-BR.md#reportar-problemas--pedir-novo-host).

## O cache me leva a um destino errado ou quebrado

Para verificar se o cache é a causa, desligue **Use cache** no menu do script (globalmente ou em **This domain**) e tente o shortlink de novo. Se funcionar sem o cache, [reporte o shortlink](README.pt-BR.md#reportar-problemas--pedir-novo-host).

## intercelestial.com

- O intercelestial.com atualiza seu código de detecção com frequência, então as correções podem demorar. Se possível, procure outras formas de encontrar o filme ou a série que deseja.
- Problemas conhecidos, como a página "Tap Continue to go on" e o aviso "Ad blocker or auto-click script detected" no Waterfox, estão documentados em [INTERCELESTIAL_ISSUES.md](/docs/INTERCELESTIAL_ISSUES.md).
- O intercelestial.com retorna **"invalid session"** se você abrir várias abas. Isso **não tem relação com este script**: mantenha apenas uma aba aberta para o shortlink.

## Ainda não funciona?

Use o comando **Report URL issue** no menu do script ou abra o formulário [Site stopped working](https://github.com/andradeatdev/auto-continue-shortlinks/issues/new?template=site-broken.yml). Informe a URL do shortlink, seu navegador e seu gerenciador de userscripts.