# Problemas do intercelestial.com

[English](/docs/INTERCELESTIAL_ISSUES.md) · **Português (BR)**

Problemas e correções específicos do intercelestial.com. Para problemas gerais, veja o [TROUBLESHOOTING.pt-BR.md](/docs/TROUBLESHOOTING.pt-BR.md).

## Índice

- [Pular a página "Tap Continue to go on"](#pular-a-página-tap-continue-to-go-on)
  - [1. Instalar uma extensão de injeção de cabeçalhos](#1-instalar-uma-extensão-de-injeção-de-cabeçalhos)
  - [2. Adicionar a regra](#2-adicionar-a-regra)
  - [3. Verificar](#3-verificar)
- [Waterfox: "Ad blocker or auto-click script detected"](#waterfox-ad-blocker-or-auto-click-script-detected)
  - [Por que acontece](#por-que-acontece)
  - [Correção: permitir apenas as requisições-isca do site](#correção-permitir-apenas-as-requisições-isca-do-site)
  - [É só o Waterfox?](#é-só-o-waterfox)

## Pular a página "Tap Continue to go on"

![Intercelestial — pular a página "Tap Continue to go on"](https://github.com/user-attachments/assets/99f00c4c-ea91-47ca-8ca2-f1f033ee3ec5)

A página é retornada quando o servidor backend não recebe o cabeçalho `Sec-Fetch-User: ?1`. O navegador só o envia quando o usuário interage com a página, ou quando uma API ou extensão modifica os cabeçalhos da requisição.

### 1. Instalar uma extensão de injeção de cabeçalhos

**Chrome**

| Extensão | Link |
|---|---|
| Requestly | <https://chromewebstore.google.com/detail/requestly-open-source-htt/mdnleldcmiljblolnjhpnblkcekpdkpa> |
| Simple Modify Header | <https://chromewebstore.google.com/detail/simple-modify-headers/gjgiipmpldkpbdfjkgofildhapegmmic> |

**Firefox**

| Extensão | Link |
|---|---|
| Header Editor | <https://addons.mozilla.org/firefox/addon/header-editor/> |
| Simple Modify Header | <https://addons.mozilla.org/firefox/addon/simple-modify-header/> |
| Requestly | <https://requestly.com/> |

### 2. Adicionar a regra

- Domínio: `intercelestial.com`
- Modificar os cabeçalhos de **requisição** (request), ação **set**:
  - `Sec-Fetch-User: ?1` — o único estritamente necessário.
  - `Sec-Fetch-Mode: navigate`, `Sec-Fetch-Dest: document` e `Sec-Fetch-Site: same-origin` — opcionais. O navegador já envia esses cabeçalhos em submits nativos; defini-los torna a regra independente de como o POST é disparado.

> [!WARNING]
> **Mantenha a regra restrita ao `intercelestial.com`. Nunca a torne global.**
> O `Sec-Fetch-User: ?1` afirma que um gesto do usuário iniciou a navegação. Forjá-lo para todas as origens informa uma ativação de usuário falsa para todos os sites que você visita e pode quebrar hosts que usam esses cabeçalhos em suas próprias heurísticas.

### 3. Verificar

- **Sem nenhuma injeção de cabeçalhos (padrão):** o fluxo termina na página "Tap Continue to go on", e um toque real a conclui. Esse é o comportamento esperado e não há nada para corrigir.
- **Com a injeção (extensão):** o fluxo redireciona direto para o destino, sem página de toque e sem clique extra.
- **Nos dois casos**, uma resposta "Please turn off the auto-click script" significa que um envio puramente programático chegou ao servidor (sem o `?1` **e** com campos de comportamento implausíveis).

## Waterfox: "Ad blocker or auto-click script detected"

Se você usa o Waterfox com o bloqueador de anúncios integrado, pode ver este erro:

> Ad blocker or auto-click script detected

### Por que acontece

O site faz uma requisição-isca ao seu backend para verificar se a página consegue carregar um recurso de anúncio. O script altera a API de requisições da página para poder reenviar essa requisição quando uma extensão a bloqueia, e assim o backend enxerga um carregamento com anúncios habilitados.

O bloqueador de anúncios integrado do Waterfox também filtra requisições feitas por extensões e userscripts, e não apenas as feitas pela própria página. Assim, a requisição reenviada também é bloqueada, o backend nunca vê a isca respondida, e a página retorna o erro de detecção mesmo com este script instalado.

### Correção: permitir apenas as requisições-isca do site

Adicione este filtro de exceção ao bloqueador de anúncios integrado do Waterfox:

```
@@||intercelestial.com^$1p,xhr
```

Como o filtro é construído:

- `@@` o torna uma regra de exceção (permitir).
- `||intercelestial.com^` o restringe a este domínio.
- `$1p` o limita a requisições de primeira parte (first-party).
- `xhr` o limita a requisições XHR/`fetch`.

Os anúncios comuns continuam bloqueados: apenas a requisição-isca é liberada.

### É só o Waterfox?

Abra o mesmo shortlink em outro navegador (Firefox, Brave etc.) com o mesmo gerenciador de userscripts instalado:

- **A detecção também aparece lá:** o site mudou seu código de detecção, então não é um problema do Waterfox. Abra uma issue com a URL do shortlink e a mensagem exata.
- **A detecção aparece apenas no Waterfox:** o bloqueador de anúncios integrado do navegador está filtrando as requisições. Aplique o filtro de exceção acima (ou desative o bloqueador integrado para o `intercelestial.com`) e recarregue a página.