# prototipo_web_desenv
repositorio de desenvolvimento do prototipo_web_desenv
# Requisitos Funcionais — Autenticação e Cadastro de Usuário

## RF001: Exibição e Interação da Tela de Login

### 1. Descrição

O sistema deve permitir que o usuário acesse a tela de login por meio de uma janela modal (centralizada na página) ao acionar o botão de login principal, possibilitando a autenticação ou o redirecionamento para o cadastro.

### 2. Interface e Campos (Modal de Login)

```
┌────────────────────────────────────────────────────────────┐
│                          [ LOGIN ]                         │
│                                                            │
│    E-mail:                                                 │
│    ┌──────────────────────────────────────────────────┐    │
│    │  Digite seu e-mail...                            │    │
│    └──────────────────────────────────────────────────┘    │
│                                                            │
│    Senha:                                                  │
│    ┌──────────────────────────────────────────────────┐    │
│    │  ••••••••••••••••                                │    │
│    └──────────────────────────────────────────────────┘    │
│                                                            │
│    ┌──────────────────────────────────────────────────┐    │
│    │                  [→]  E N T R A R                │    │
│    └──────────────────────────────────────────────────┘    │
│                                                            │
│                Primeiro acesso? Cadastre-se                │
└────────────────────────────────────────────────────────────┘
```

| Campo / Elemento | Tipo              | Espelhamento / Placeholder      | Comportamento / Restrição                             |
|-------------------|--------------------|-----------------------------------|----------------------------------------------------------|
| Título            | Texto              | "Login"                          | Centralizado no topo da modal.                            |
| E-mail            | Input (Texto)      | "email"                          | Campo obrigatório para inserção do e-mail do usuário.     |
| Senha             | Input (Password)   | "senha"                          | Campo obrigatório, com caracteres ocultos por padrão.      |
| Entrar            | Botão (Submit)     | "ENTRAR [Ícone de Entrar]"       | Dispara o evento `onsubmit` para validação.                |
| Cadastre-se       | Link (Texto)       | "Primeiro acesso? Cadastre-se"  | Texto clicável apenas na palavra "Cadastre-se".            |

### 3. Regras de Negócio e Comportamento

- **Abertura da Modal**: o formulário de login deve ser renderizado em uma janela modal centralizada na tela imediatamente após o clique no botão de login da página principal.
- **Evento de Submissão**: o botão **[ENTRAR]** deve interceptar o envio através do evento `onsubmit`, validando se os campos de e-mail e senha foram preenchidos antes de enviar os dados para autenticação.
- **Redirecionamento**: ao clicar no link "Cadastre-se", a modal deve ser fechada (ou a ação abortada) e o usuário deve ser redirecionado para a página de Cadastro de Usuários.

### 4. Critérios de Aceite

- [ ] A janela de login abre centralizada e bloqueia o fundo da tela (comportamento padrão de modal).
- [ ] Os placeholders "email" e "senha" desaparecem assim que o usuário começa a digitar.
- [ ] O botão "ENTRAR" possui o ícone visual indicado no protótipo.
- [ ] O clique em "Cadastre-se" redireciona o usuário para a URL correta de cadastro.

---

## RF002: Tela de Cadastro de Usuário

### 1. Descrição

O sistema deve permitir a abertura de uma tela de cadastro de usuários por meio de uma janela modal centralizada na página, disparada imediatamente após o acionamento do link ou botão "Cadastre-se". A tela deve coletar os dados cadastrais básicos (Nome, E-mail e Senha) obrigatórios para a criação de uma nova conta no sistema.

### 2. Interface e Campos (Modal de Cadastro)

```
┌──────────────────────────────────────────────────────────┐
│                   Cadastro de Usuário                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Nome                                                    │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Nome                                             │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  Email                                                   │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Email                                            │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  Senha                       Confirmar Senha             │
│  ┌────────────────────────┐  ┌────────────────────────┐  │
│  │ Senha                  │  │ Confirmar Senha        │  │
│  └────────────────────────┘  └────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │                 [+] Cadastrar                    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Campo / Elemento | Tipo              | Espelhamento / Placeholder | Comportamento / Restrição                                                                 |
|-------------------|--------------------|-------------------------------|--------------------------------------------------------------------------------------------|
| Título            | Texto              | "Cadastro de Usuário"        | Centralizado no topo da modal.                                                              |
| Nome              | Input (Texto)      | "Nome"                        | Campo obrigatório. Aceita apenas caracteres alfabéticos e espaços.                          |
| E-mail            | Input (Texto)      | "Email"                       | Campo obrigatório. Deve validar a estrutura padrão de e-mail (exemplo@dominio.com).         |
| Senha             | Input (Password)   | "Senha"                       | Campo obrigatório, com caracteres ocultos por padrão. Disposto lado a lado com "Confirmar Senha". |
| Confirmar Senha   | Input (Password)   | "Confirmar Senha"            | Campo obrigatório, com caracteres ocultos por padrão. Utilizado para dupla validação.        |
| Cadastrar         | Botão (Submit)     | "[+] Cadastrar"               | Dispara o evento de validação e criação da conta. Possui um ícone de adição [+].            |

### 3. Regras de Negócio e Comportamento

- **Abertura da Modal**: a janela de cadastro deve ser renderizada em formato modal centralizada sobre a tela atual, aplicando um efeito de fundo fosco (backdrop) para impedir interações com o resto da página até que seja fechada ou concluída.
- **Layout Responsivo (Lado a Lado)**: os campos "Senha" e "Confirmar Senha" devem ser exibidos na mesma linha horizontal (alinhamento em colunas paralelas), dividindo proporcionalmente o espaço útil da modal.
- **Validação de Redundância (Senhas idênticas)**: ao acionar o botão **[Cadastrar]**, o sistema deve interceptar a submissão e comparar textualmente os valores dos campos "Senha" e "Confirmar Senha". Caso divirjam, o envio deve ser cancelado e um alerta visual de erro deve ser exibido.
- **Obrigatoriedade**: todos os campos de entrada apresentados na interface são de preenchimento obrigatório para a conclusão da ação de cadastro.

### 4. Critérios de Aceite

- [ ] A janela de cadastro abre centralizada de forma fluida a partir do clique em "Cadastre-se".
- [ ] Os campos "Senha" e "Confirmar Senha" permanecem perfeitamente alinhados lado a lado em resoluções desktop.
- [ ] Os placeholders ("Nome", "Email", "Senha", "Confirmar Senha") desaparecem no momento em que o foco é acionado e a digitação é iniciada.
- [ ] O botão "Cadastrar" exibe o ícone [+] antecedendo o texto, conforme especificado no protótipo textual.
- [ ] O sistema impede o cadastro caso haja algum campo em branco ou se as senhas não forem estritamente iguais.

# RF003: Tela de Cadastro de Ordem de Serviço

## 1. Descrição

Este requisito define a tela de cadastro de Ordem de Serviço, na qual o usuário registra os dados do serviço, do cliente/fazenda, da aeronave e piloto responsáveis, as condições climáticas da aplicação (Índice Delta T) e observações complementares — substituindo o preenchimento manual do relatório em papel.

A tela é organizada em quatro blocos numerados, seguindo a ordem lógica de preenchimento:
1. Dados do Serviço
2. Dados do Cliente
3. Dados da Aeronave
4. Índice Delta T

## 2. Interface e Campos

```
┌─────────────────────────────────────────────────────────────────────────┐
│ (i) Campos marcados com * são obrigatórios.                             │
├─────────────────────────────────────────────────────────────────────────┤
│  1 - DADOS DO SERVIÇO                                                   │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐     │
│  │ Data da aplicação *         │    │ Tipo de serviço *           │     │
│  │ [ dd/mm/aaaa             ]  │    │ [ Herbicida            v]   │     │
│  └─────────────────────────────┘    └─────────────────────────────┘     │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐     │
│  │ Cultura *                   │    │ Área (ha) *                 │     │
│  │ [ Ex: Soja, Milho, Café  ]  │    │ [   0,00         ][ ha ]    │     │
│  └─────────────────────────────┘    └─────────────────────────────┘     │
├──────────────────── (linha divisória) ──────────────────────────────────┤
│  2 - DADOS DO CLIENTE                                                   │
│  Tipo de documento:  ( * ) 1 - CNPJ  (  ) 2 - CPF   [00.000.000/0001-00]│
│  ┌───────────────────────────────────────────────────────────────┐      │
│  │ Cliente/Fazenda *                                             │      │
│  │ [ Nome do cliente ou fazenda                               ]  │      │
│  └───────────────────────────────────────────────────────────────┘      │
│  ┌───────────────────────────────────┐  ┌───────────────────────┐       │
│  │ Endereço do cliente               │  │ Propriedade           │       │
│  │ [ Rodovia, km...              ]   │  │[ Nome da propriedade ]│       │
│  └───────────────────────────────────┘  └───────────────────────┘       │
│  ┌───────────────────┐   ┌─────────────────────────────────────────┐    │
│  │ UF                │   │ Município                               │    │
│  │ [ UF  ]           │   │ [ Cidade ]                              │    │
│  └───────────────────┘   └─────────────────────────────────────────┘    │
├──────────────────── (linha divisória) ──────────────────────────────────┤
│  3 - DADOS DA AERONAVE                                                  │
│  ┌─────────────────────────────────────────────┐  ┌──────────────────┐  │
│  │ Aeronave        (avião) Ver catálogo        │  │Piloto *          │  │
│  │ [ Fabricante v ][ Modelo/prefixo do drone ] │  │ [ Nome do piloto]|  │
│  └─────────────────────────────────────────────┘  └──────────────────┘  │
│  ┌─────────────────────────────┐                                        │
│  │ Número de identificação     │                                        │
│  │ [ Nº de registro / série ]  │                                        │
│  └─────────────────────────────┘                                        │
├─────────────────────────────────────────────────────────────────────────┤
│  #### 4 - ÍNDICE DELTA T (fundo verde) ####                             │
│  ┌────────────────┐  ┌────────────────────┐  ┌────────────────────┐     │
│  │ Temp. ar (°C)  │  │ Umidade rel. (%)   │  │ Vel. vento (km/h)  │     │
│  │ [   0,0    ]   │  │ [    0,0     ]     │  │ [    0,0     ]     │     │
│  └────────────────┘  └────────────────────┘  └────────────────────┘     │
├─────────────────────────────────────────────────────────────────────────┤
│  Observações                                                            │
│  ┌───────────────────────────────────────────────────────────────┐      │
│  │ Informações adicionais sobre a ordem de serviço...            │      │
│  │                                                               │      │
│  └───────────────────────────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────────────────────────┤
│  [ LOG DE VOO ] (*)                         [ X Limpar ] [ Gravar ]     │
└─────────────────────────────────────────────────────────────────────────┘
(*) "LOG DE VOO" só é exibido quando Fabricante = Gteex
```

### 2.1 Relação de campos

| Seção | Campo | Tipo | Obrig. | Observação |
|---|---|---|---|---|
| 1 - Dados do Serviço | Data da aplicação | Data | Sim | - |
| 1 - Dados do Serviço | Tipo de serviço | Lista (select) | Sim | Herbicida, Fungicida, Inseticida, Adubação foliar |
| 1 - Dados do Serviço | Cultura | Texto | Sim | Ex: Soja, Milho, Café |
| 1 - Dados do Serviço | Área (ha) | Numérico | Sim | Sufixo fixo "ha" |
| 2 - Dados do Cliente | Tipo de documento | Rádio (1 ou 2) | - | Define máscara CNPJ ou CPF |
| 2 - Dados do Cliente | CNPJ / CPF | Texto c/ máscara | Não | Label e máscara mudam conforme seleção |
| 2 - Dados do Cliente | Cliente/Fazenda | Texto | Sim | Campo em largura total |
| 2 - Dados do Cliente | Endereço do cliente | Texto | Não | - |
| 2 - Dados do Cliente | Propriedade | Texto | Não | - |
| 2 - Dados do Cliente | UF | Lista (select) | Não | 27 estados do Brasil |
| 2 - Dados do Cliente | Município | Texto | Não | - |
| 3 - Dados da Aeronave | Fabricante | Lista (select) | Não | Gteex, DJI, XAG |
| 3 - Dados da Aeronave | Aeronave (modelo) | Texto | Não | - |
| 3 - Dados da Aeronave | Piloto | Texto | Sim | - |
| 3 - Dados da Aeronave | Número de identificação | Texto | Não | Nº de registro/série da aeronave |
| 4 - Índice Delta T | Temperatura do ar | Numérico (°C) | Não | - |
| 4 - Índice Delta T | Umidade relativa | Numérico (%) | Não | - |
| 4 - Índice Delta T | Velocidade do vento | Numérico (km/h) | Não | - |
| - | Observações | Texto longo | Não | Campo em largura total |

## 3. Regras de Negócio e Comportamento

1. **Campos obrigatórios**: Data da aplicação, Tipo de serviço, Cultura, Área (ha), Cliente/Fazenda e Piloto são de preenchimento obrigatório, sinalizados com `*` em vermelho. O sistema deve impedir o envio do formulário caso algum desses campos esteja vazio.

2. **Alternância CNPJ/CPF**: ao selecionar "1 - CNPJ", o campo de documento exibe o rótulo "CNPJ" e aplica a máscara `00.000.000/0001-00`. Ao selecionar "2 - CPF", o rótulo muda para "CPF" e a máscara passa a ser `000.000.000-00`. Se o usuário já tiver digitado algum valor antes de trocar a opção, o conteúdo deve ser reformatado automaticamente para a nova máscara.

3. **Botão "LOG DE VOO" condicional**: este botão só deve ficar visível quando o campo Fabricante (seção Dados da Aeronave) estiver preenchido com o valor "Gteex". Para qualquer outro fabricante (DJI, XAG) ou campo vazio, o botão permanece oculto, mas o alinhamento dos demais botões (Limpar/Gravar) não deve ser afetado.

4. **Botão "Limpar"**: restaura todos os campos do formulário para o estado inicial (vazio), sem exigir confirmação adicional.

5. **Botão "Gravar ordem de serviço"**: submete o formulário. Antes de gravar, o sistema deve validar os campos obrigatórios (regra 1); se houver pendência, o envio é bloqueado e o usuário deve ser orientado a completar os campos faltantes.

6. **Seção "Índice Delta T"**: apresenta destaque visual (fundo e borda em verde, título em azul escuro e negrito) para diferenciá-la das demais seções, por se tratar de dado climático de apoio à decisão da aplicação.

7. **Link "Ver catálogo"**: disponível ao lado do campo Aeronave, deve permitir a navegação/consulta ao catálogo de aeronaves cadastradas (comportamento de destino a ser detalhado em requisito de navegação específico).

8. **Layout responsivo dos campos combinados**: os pares Endereço do cliente/Propriedade e UF/Município devem permanecer sempre na mesma linha, mantendo suas proporções relativas de largura.

## 4. Critérios de Aceite

1. [ ] A tela exibe as quatro seções na ordem: 1 - Dados do Serviço, 2 - Dados do Cliente, 3 - Dados da Aeronave, 4 - Índice Delta T, com títulos em negrito e cor azul escura.
2. [ ] Há uma linha divisória destacada entre as seções 1→2 e 2→3.
3. [ ] O aviso "Campos marcados com * são obrigatórios" é exibido no topo da tela.
4. [ ] Tentar gravar o formulário com algum campo obrigatório vazio impede o envio.
5. [ ] Selecionar "1 - CNPJ" aplica a máscara de CNPJ no campo de documento; selecionar "2 - CPF" aplica a máscara de CPF, com o rótulo do campo atualizado corretamente.
6. [ ] O campo UF apresenta as 27 unidades federativas do Brasil como opções de seleção.
7. [ ] Os campos UF e Município aparecem lado a lado na mesma linha.
8. [ ] Os campos Endereço do cliente e Propriedade aparecem lado a lado na mesma linha.
9. [ ] O botão "LOG DE VOO" só é exibido quando Fabricante = "Gteex"; ao trocar para DJI, XAG ou deixar vazio, o botão desaparece imediatamente.
10. [ ] A seção "Índice Delta T" é visualmente destacada em verde.
11. [ ] O botão "Limpar" restaura todos os campos para o estado inicial.
12. [ ] O botão "Gravar ordem de serviço" está visualmente destacado (verde, com ícone) em relação aos demais botões.
