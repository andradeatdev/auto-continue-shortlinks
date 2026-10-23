**Português (BR)** • [English](INTERCELESTIAL_ISSUES.md)

## Como fazer a página pular a tela "Tap Continue to go on"

![Intercelestial — Como fazer a página pular a tela "Tap Continue to go on"](https://github.com/user-attachments/assets/99f00c4c-ea91-47ca-8ca2-f1f033ee3ec5)

A página é retornada quando o backend não recebe o header `"Sec-Fetch-User": "?1"`. Só que o
navegador só envia esse header quando o usuário interage com a página — ou quando você usa
alguma API/extensão para alterar os headers da requisição.

### 1. Instale uma extensão que injeta headers

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

### 2. Adicione a regra

- Domínio: `intercelestial.com`
- Altere os headers da **requisição**, com ação **set**:
  - `Sec-Fetch-User: ?1` ← o único estritamente necessário
  - `Sec-Fetch-Mode: navigate` / `Sec-Fetch-Dest: document` / `Sec-Fetch-Site: same-origin`
    (opcional — o navegador já envia esses headers em envios nativos; incluir deixa a regra
    independente de como o POST é disparado)

**Deixe a regra restrita a `intercelestial.com` — nunca global.** O `Sec-Fetch-User: ?1` afirma
que "um gesto do usuário iniciou esta navegação"; forjá-lo para todas as origens significa mentir
sobre ativação do usuário em todo site que você visita, e isso pode quebrar sites que usam esses
headers nas próprias heurísticas.

### 3. Verifique

- **Sem nenhuma injeção de header (padrão):** o gate termina na página "Tap Continue to go on" e
  um toque de verdade conclui. É o comportamento esperado — não há nada para corrigir.
- **Com a injeção (extensão):** o gate redireciona direto para o destino — sem página Tap e sem
  clique extra.
- Em qualquer um dos casos, a resposta "Please turn off the auto-click script" significa que um
  envio puramente programático chegou ao servidor (sem o `?1` **e** com campos de comportamento
  implausíveis).

## Waterfox retorna "Ad blocker or auto-click script detected"

Se você usa o Waterfox com o adblock nativo, pode ver o seguinte erro:

> Ad blocker or auto-click script detected

O site faz uma requisição de isca para o próprio backend para verificar se a página consegue
carregar um recurso de anúncio. O script faz patch na API de requisição da página para repetir
essa requisição quando uma extensão a bloqueia, e assim o backend vê um carregamento com
anúncio.

O adblock nativo do Waterfox também filtra requisições feitas por extensões e userscripts — não
só as feitas pela própria página. Então a requisição repetida pelo script também é bloqueada, o
backend nunca vê a isca respondida e a página mostra o erro de detecção acima mesmo com o script
instalado.

### Correção: libere apenas as bait requests do site

Adicione este filtro de exceção ao adblock nativo do Waterfox:

@@||intercelestial.com^$1p,xhr

`@@` é uma regra de exceção (permitir), `||intercelestial.com^` limita ao domínio, `$1p` vale
para requisições first-party e `$xhr` para XHR/`fetch`. Os anúncios continuam bloqueados, só a
isca passa.

#### É só no Waterfox?

Abra o mesmo shortlink em outro navegador (Firefox, Brave etc.) com o mesmo gerenciador de
userscripts instalado:

- **A detecção também aparece lá** → o site mudou o código de detecção, não é problema do
  Waterfox. Abra uma issue com a URL do shortlink e a mensagem exata.
- **A detecção aparece só no Waterfox** → o adblock nativo do navegador está filtrando as
  requisições. Aplique o filtro de exceção acima (ou desative o adblock nativo para
  `intercelestial.com`) e recarregue.
