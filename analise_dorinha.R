# =============================================================
# ANÁLISE DE DADOS — COSTURA DA DORINHA
# Trabalho de Extensão — Análise de Dados
# =============================================================

# --- 1. CARREGAMENTO DOS DADOS ----------------------------------

# Verifica diferentes caminhos onde o CSV pode estar salvo
possiveis_caminhos <- c(
  "pedidos_dorinha.csv",
  "backend/public/uploads/pedidos_dorinha.csv",
  "backend/public/exports/pedidos_dorinha.csv",
  "public/uploads/pedidos_dorinha.csv",
  "public/exports/pedidos_dorinha.csv"
)

arquivo_csv <- NULL
for (caminho in possiveis_caminhos) {
  if (file.exists(caminho)) {
    arquivo_csv <- caminho
    break
  }
}

if (is.null(arquivo_csv)) {
  stop("Erro: Arquivo 'pedidos_dorinha.csv' não encontrado. Certifique-se de realizar o download/exportação pelo sistema primeiro.")
}

cat("Lendo arquivo de:", arquivo_csv, "\n")
dados <- read.csv2(arquivo_csv, fileEncoding = "UTF-8-BOM", stringsAsFactors = FALSE)

# Verificação inicial
cat("=== ESTRUTURA DOS DADOS ===\n")
str(dados)
cat("\n")

# Conversão de tipos
dados$material  <- as.numeric(dados$material)
dados$maoDeObra <- as.numeric(dados$maoDeObra)
dados$total     <- as.numeric(dados$total)
dados$data      <- as.Date(dados$data, format = "%d/%m/%Y")

cat("=== PRIMEIRAS LINHAS ===\n")
print(head(dados))
cat("\n")


# --- 2. CLASSIFICAÇÃO DAS VARIÁVEIS ----------------------------

cat("=== CLASSIFICAÇÃO DAS VARIÁVEIS ===\n")
cat("Variáveis QUALITATIVAS (categóricas):\n")
cat("  - cliente : nominal\n")
cat("  - tipo    : nominal\n")
cat("  - descricao: nominal\n")
cat("  - data    : ordinal (temporal)\n\n")

cat("Variáveis QUANTITATIVAS (numéricas):\n")
cat("  - material  : contínua (R$)\n")
cat("  - maoDeObra : contínua (R$)\n")
cat("  - total     : contínua (R$)\n\n")


# --- 3. DISTRIBUIÇÃO DE FREQUÊNCIA POR TIPO --------------------

cat("=== DISTRIBUIÇÃO DE FREQUÊNCIA POR TIPO DE SERVIÇO ===\n")
freq_abs  <- table(dados$tipo)
freq_rel  <- prop.table(freq_abs) * 100
freq_acum <- cumsum(freq_abs)

tabela_freq <- data.frame(
  Tipo              = names(freq_abs),
  Frequencia_Abs    = as.integer(freq_abs),
  Frequencia_Rel_pct = round(as.numeric(freq_rel), 1),
  Frequencia_Acum   = as.integer(freq_acum)
)
print(tabela_freq)
cat("\n")


# --- 4. MEDIDAS DE TENDÊNCIA CENTRAL ---------------------------

# Função moda (R não tem função nativa)
moda <- function(x) {
  ux <- unique(x)
  ux[which.max(tabulate(match(x, ux)))]
}

cat("=== MEDIDAS DE TENDÊNCIA CENTRAL - VALOR TOTAL (R$) ===\n")
cat("Média   :", round(mean(dados$total), 2), "\n")
cat("Mediana :", round(median(dados$total), 2), "\n")
cat("Moda    :", moda(dados$total), "\n\n")

cat("=== MEDIDAS DE TENDÊNCIA CENTRAL POR TIPO DE SERVIÇO ===\n")
medias <- aggregate(total ~ tipo, data = dados, FUN = function(x)
  c(Media = round(mean(x), 2), Mediana = round(median(x), 2)))
print(medias)
cat("\n")


# --- 5. MEDIDAS DE DISPERSÃO -----------------------------------

cat("=== MEDIDAS DE DISPERSÃO - VALOR TOTAL (R$) ===\n")
variancia <- var(dados$total)
desvio    <- sd(dados$total)
cv        <- (desvio / mean(dados$total)) * 100

cat("Variância          :", round(variancia, 2), "\n")
cat("Desvio-padrão      :", round(desvio, 2), "\n")
cat("Coeficiente de Var.:", round(cv, 1), "%\n\n")

cat("=== DISPERSÃO POR TIPO DE SERVIÇO ===\n")
dispersao <- aggregate(total ~ tipo, data = dados, FUN = function(x)
  c(DP = round(sd(x), 2), CV_pct = round((sd(x) / mean(x)) * 100, 1)))
print(dispersao)
cat("\n")


# --- 6. GRÁFICOS -----------------------------------------------

# Configuração de layout: 2x2. Aumentando a margem inferior (bottom) para acomodar os labels verticais
par(mfrow = c(2, 2), mar = c(7, 4, 4, 2))

## 6.1 — Gráfico de Barras: Frequência por tipo
barplot(
  freq_abs,
  main   = "Frequência de Pedidos por Tipo",
  xlab   = "",
  ylab   = "Quantidade de Pedidos",
  col    = c("#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F4A460"),
  las    = 2,
  border = "white"
)

## 6.2 — Histograma: Distribuição dos valores totais
hist(
  dados$total,
  main   = "Distribuição dos Valores Cobrados (R$)",
  xlab   = "Valor Total (R$)",
  ylab   = "Frequência",
  col    = "#CD853F",
  border = "white",
  breaks = 8
)

## 6.3 — Boxplot: Valores por tipo de serviço
boxplot(
  total ~ tipo,
  data   = dados,
  main   = "Boxplot - Valor Total por Tipo de Serviço",
  xlab   = "",
  ylab   = "Valor Total (R$)",
  col    = c("#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F4A460"),
  border = "#5C2E00",
  las    = 2
)

## 6.4 — Gráfico de Barras: Faturamento total por tipo
fat_tipo <- aggregate(total ~ tipo, data = dados, FUN = sum)
barplot(
  fat_tipo$total,
  names.arg = fat_tipo$tipo,
  main      = "Faturamento Total por Tipo (R$)",
  xlab      = "",
  ylab      = "Faturamento (R$)",
  col       = c("#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F4A460"),
  border    = "white",
  las       = 2
)

# Restaura layout padrão
par(mfrow = c(1, 1))


# --- 7. RESUMO FINAL -------------------------------------------

cat("=== RESUMO EXECUTIVO ===\n")
cat("Total de pedidos registrados :", nrow(dados), "\n")
cat("Período analisado            :", format(min(dados$data), "%d/%m/%Y"),
    "a", format(max(dados$data), "%d/%m/%Y"), "\n")
cat("Faturamento total            : R$", round(sum(dados$total), 2), "\n")
cat("Ticket médio geral           : R$", round(mean(dados$total), 2), "\n")
cat("Serviço mais frequente       :", names(which.max(freq_abs)), "\n")
cat("Serviço de maior faturamento :", fat_tipo$tipo[which.max(fat_tipo$total)], "\n")
cat("\nAnálise concluída com sucesso!\n")
