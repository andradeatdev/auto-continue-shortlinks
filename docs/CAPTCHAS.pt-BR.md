# CAPTCHAs

[English](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/CAPTCHAS.md) · **Português (BR)**

## Índice

- [Ação manual necessária](#ação-manual-necessária)
- [hCaptcha](#hcaptcha)
  - [Cookie de acessibilidade](#cookie-de-acessibilidade)
  - [Como configurar](#como-configurar)
  - [Se o desafio continuar aparecendo](#se-o-desafio-continuar-aparecendo)

## Ação manual necessária

Este script **não resolve CAPTCHAs** e não pretende resolver. Ele apenas automatiza cliques, remove elementos desnecessários e realiza outras ações simples nas páginas de shortlink.

Sempre que um shortlink exibir um CAPTCHA, **você precisa resolvê-lo manualmente**. Depois disso, o script continua o processo sozinho.

## hCaptcha

Vários dos hosts suportados usam o [hCaptcha](https://www.hcaptcha.com/).

### Cookie de acessibilidade

O hCaptcha oferece uma opção de acessibilidade que pode reduzir ou eliminar a necessidade de resolver desafios visuais. Depois do cadastro, o hCaptcha fornece ao seu navegador um cookie criptografado. Dependendo da configuração de cada site, o cookie permite passar automaticamente ou apresenta um desafio de acessibilidade no lugar do desafio visual.

Esse recurso foi pensado como acomodação para pessoas que têm dificuldade com desafios visuais. Consulte a [página de acessibilidade](https://www.hcaptcha.com/learning/accessibility/hcaptcha-accessibility/) do próprio hCaptcha para ver se ele se aplica ao seu caso.

### Como configurar

1. Acesse <https://dashboard.hcaptcha.com/welcome_accessibility>.
2. Se ainda não tiver conta, crie uma e verifique seu e-mail. Se já tiver, é só fazer login.
3. Na página **Set Cookie**, clique no botão **Set Cookie**.
4. Visite uma página que exiba o hCaptcha. Você deve passar automaticamente ou receber um desafio de acessibilidade.

![Página de acessibilidade do hCaptcha](https://github.com/andradeatdev/auto-continue-shortlinks/blob/main/docs/images/hcaptcha-accessibility.png)

O que vale saber:

- O cookie é armazenado **por navegador/dispositivo**. Se você usa vários dispositivos, faça login e clique em **Set Cookie** em cada um deles.
- O cookie precisa ser **renovado periodicamente**: faça login e clique em **Set Cookie** novamente quando o desafio voltar a aparecer.
- O cookie pode ser usado várias vezes por dia, mas não é ilimitado. O hCaptcha informa que esse método tem limite de uso rigoroso, e pode ser necessário aguardar caso seja detectado comportamento incomum no seu computador.
- Ele só funciona enquanto o hCaptcha puder definir e ler cookies nos sites que você visita.

### Se o desafio continuar aparecendo

O cookie de acessibilidade é um cookie de terceiros (pertence ao `hcaptcha.com`, mas é lido em outros sites), então ferramentas de privacidade costumam bloqueá-lo:

- **Bloqueadores de anúncios e extensões de privacidade** (uBlock Origin, AdGuard etc.): permita `hcaptcha.com` e `*.hcaptcha.com`.
- **Firefox:** se a Proteção Aprimorada contra Rastreamento (Enhanced Tracking Protection) estiver com a opção de cookies em **Isolate cross-site cookies**, o iframe do CAPTCHA não envia o cookie de acessibilidade. Nesse caso, pode ser necessário usar **Allow all cookies** ou desativar a proteção para o domínio `hcaptcha.com` e para o site em que você está resolvendo o CAPTCHA.
- **Safari e Brave:** bloqueiam cookies entre sites por padrão. Permita cookies do `hcaptcha.com` ou desative a prevenção de rastreamento entre sites (a página de acessibilidade do hCaptcha tem instruções).
- **Cookie expirado:** faça login no painel do hCaptcha e clique em **Set Cookie** novamente.

Para outros problemas, entre em contato com o suporte do hCaptcha pela página de acessibilidade deles.