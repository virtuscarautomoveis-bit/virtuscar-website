
/* =========================================================
   VIRTUSCAR ACADEMY — SISTEMA DE PROGRESSO
   Versão: Módulos 01–06 | Aulas 01–34 | Testes 01–06
   ========================================================= */

const VirtusCarProgress = {

    STORAGE_KEY: "virtuscar_progress",

    // =====================================================
    // ESTRUTURA INICIAL
    // =====================================================

    criarProgressoInicial() {
        return {
            aulas: {
                "aula-01": false,
                "aula-02": false,
                "aula-03": false,
                "aula-04": false
            },

            teste01: {
                concluido: false,
                nota: 0,
                aprovado: false
            },

            modulo02: this.criarModulo([
                "aula-05", "aula-06", "aula-07",
                "aula-08", "aula-09", "aula-10"
            ]),

            modulo03: this.criarModulo([
                "aula-11", "aula-12", "aula-13",
                "aula-14", "aula-15", "aula-16"
            ]),

            modulo04: this.criarModulo([
                "aula-17", "aula-18", "aula-19",
                "aula-20", "aula-21", "aula-22"
            ]),

            modulo05: this.criarModulo([
                "aula-23", "aula-24", "aula-25",
                "aula-26", "aula-27", "aula-28"
            ]),

            modulo06: this.criarModulo([
                "aula-29", "aula-30", "aula-31",
                "aula-32", "aula-33", "aula-34"
            ])
        };
    },

    criarModulo(listaAulas) {
        const aulas = {};

        listaAulas.forEach(aula => {
            aulas[aula] = false;
        });

        return {
            aulas,
            teste: {
                concluido: false,
                nota: 0,
                aprovado: false
            }
        };
    },

    // =====================================================
    // CARREGAR E NORMALIZAR O PROGRESSO
    // =====================================================

    getProgress() {
        const inicial = this.criarProgressoInicial();
        let guardado = null;

        try {
            const texto = localStorage.getItem(this.STORAGE_KEY);

            if (texto) {
                guardado = JSON.parse(texto);
            }
        } catch (erro) {
            console.error("Erro ao carregar progresso:", erro);
        }

        const progress = guardado && typeof guardado === "object"
            ? guardado
            : inicial;

        if (!progress.aulas || typeof progress.aulas !== "object") {
            progress.aulas = {};
        }

        if (!progress.teste01 || typeof progress.teste01 !== "object") {
            progress.teste01 = {
                concluido: false,
                nota: 0,
                aprovado: false
            };
        }

        // Garantir que existem os seis módulos.
        [
            "modulo02",
            "modulo03",
            "modulo04",
            "modulo05",
            "modulo06"
        ].forEach(modulo => {

            if (!progress[modulo] || typeof progress[modulo] !== "object") {
                progress[modulo] = inicial[modulo];
            }

            if (!progress[modulo].aulas || typeof progress[modulo].aulas !== "object") {
                progress[modulo].aulas = {};
            }

            if (!progress[modulo].teste || typeof progress[modulo].teste !== "object") {
                progress[modulo].teste = {
                    concluido: false,
                    nota: 0,
                    aprovado: false
                };
            }
        });

        // Garantir todas as aulas do Módulo 01.
        Object.keys(inicial.aulas).forEach(aula => {
            if (progress.aulas[aula] === undefined) {
                progress.aulas[aula] = false;
            }
        });

        // Garantir todas as aulas dos Módulos 02 a 06.
        [
            "modulo02",
            "modulo03",
            "modulo04",
            "modulo05",
            "modulo06"
        ].forEach(modulo => {

            Object.keys(inicial[modulo].aulas).forEach(aula => {
                if (progress[modulo].aulas[aula] === undefined) {
                    progress[modulo].aulas[aula] = false;
                }
            });
        });

        // Normalizar os dados de todos os testes.
        const testes = [
            progress.teste01,
            progress.modulo02.teste,
            progress.modulo03.teste,
            progress.modulo04.teste,
            progress.modulo05.teste,
            progress.modulo06.teste
        ];

        testes.forEach(teste => {
            if (teste.concluido === undefined) teste.concluido = false;
            if (teste.nota === undefined) teste.nota = 0;
            if (teste.aprovado === undefined) teste.aprovado = false;
        });

        // =================================================
        // MIGRAÇÃO DAS AULAS ANTIGAS
        // =================================================

        for (let numero = 17; numero <= 34; numero++) {

            const aula = "aula-" + String(numero).padStart(2, "0");
            const chaveAntiga = "virtuscar_" + aula.replace("-", "_");

            try {
                if (localStorage.getItem(chaveAntiga) === "true") {

                    const modulo = this.obterModuloDaAula(aula);

                    if (modulo === "modulo01") {
                        progress.aulas[aula] = true;
                    } else if (modulo) {
                        progress[modulo].aulas[aula] = true;
                    }
                }
            } catch (erro) {
                console.error("Erro ao migrar aula:", aula, erro);
            }
        }

        // =================================================
        // RECUPERAR APROVAÇÕES ANTIGAS DOS TESTES
        // =================================================

        this.migrarTesteAntigo(
            progress.teste01,
            "virtuscar_teste_01_aprovado"
        );

        this.migrarTesteAntigo(
            progress.modulo02.teste,
            "virtuscar_teste_02_aprovado"
        );

        this.migrarTesteAntigo(
            progress.modulo03.teste,
            "virtuscar_teste_03_aprovado"
        );

        this.migrarTesteAntigo(
            progress.modulo04.teste,
            "virtuscar_teste_04_aprovado"
        );

        this.migrarTesteAntigo(
            progress.modulo05.teste,
            "virtuscar_teste_05_aprovado"
        );

        // Teste 06: recuperar a aprovação já existente.
        this.migrarTesteAntigo(
            progress.modulo06.teste,
            "virtuscar_teste_06_aprovado"
        );

        // Recuperar a nota guardada pelo Teste 06.
        try {
            const notaTeste06 = localStorage.getItem(
                "virtuscar_teste_06_nota"
            );

            if (notaTeste06 !== null) {
                progress.modulo06.teste.nota = this.validarNota(notaTeste06);
            }
        } catch (erro) {
            console.error("Erro ao recuperar nota do Teste 06:", erro);
        }

        this.saveProgress(progress);

        return progress;
    },

    obterModuloDaAula(aula) {
        const numero = Number(aula.replace("aula-", ""));

        if (numero >= 1 && numero <= 4) return "modulo01";
        if (numero >= 5 && numero <= 10) return "modulo02";
        if (numero >= 11 && numero <= 16) return "modulo03";
        if (numero >= 17 && numero <= 22) return "modulo04";
        if (numero >= 23 && numero <= 28) return "modulo05";
        if (numero >= 29 && numero <= 34) return "modulo06";

        return null;
    },

    migrarTesteAntigo(teste, chave) {
        try {
            if (localStorage.getItem(chave) === "true") {
                teste.concluido = true;
                teste.aprovado = true;

                if (!teste.nota) {
                    teste.nota = 80;
                }
            }
        } catch (erro) {
            console.error("Erro ao migrar teste:", chave, erro);
        }
    },

    // =====================================================
    // GUARDAR PROGRESSO
    // =====================================================

    saveProgress(progress) {
        try {
            localStorage.setItem(
                this.STORAGE_KEY,
                JSON.stringify(progress)
            );

            return true;
        } catch (erro) {
            console.error("Erro ao guardar progresso:", erro);
            return false;
        }
    },

    // =====================================================
    // CONCLUIR E VERIFICAR AULAS
    // =====================================================

    concluirAula(aula) {
        const progress = this.getProgress();
        const modulo = this.obterModuloDaAula(aula);

        if (!modulo) {
            console.warn("Aula não encontrada:", aula);
            return false;
        }

        if (modulo === "modulo01") {
            progress.aulas[aula] = true;
        } else {
            progress[modulo].aulas[aula] = true;
        }

        // Manter compatibilidade com as chaves antigas.
        try {
            localStorage.setItem(
                "virtuscar_" + aula.replace("-", "_"),
                "true"
            );
        } catch (erro) {
            console.error("Erro ao guardar aula individual:", erro);
        }

        return this.saveProgress(progress);
    },

    aulaConcluida(aula) {
        const progress = this.getProgress();
        const modulo = this.obterModuloDaAula(aula);

        if (!modulo) return false;

        if (modulo === "modulo01") {
            return progress.aulas[aula] === true;
        }

        return progress[modulo].aulas[aula] === true;
    },

    // =====================================================
    // DESBLOQUEIO DAS AULAS
    // =====================================================

    podeAbrirAula(aula) {
        const progress = this.getProgress();

        const regras = {

            // MÓDULO 01
            "aula-01": () => true,
            "aula-02": () => progress.aulas["aula-01"],
            "aula-03": () => progress.aulas["aula-02"],
            "aula-04": () => progress.aulas["aula-03"],

            // MÓDULO 02
            "aula-05": () => progress.teste01.aprovado,
            "aula-06": () => progress.modulo02.aulas["aula-05"],
            "aula-07": () => progress.modulo02.aulas["aula-06"],
            "aula-08": () => progress.modulo02.aulas["aula-07"],
            "aula-09": () => progress.modulo02.aulas["aula-08"],
            "aula-10": () => progress.modulo02.aulas["aula-09"],

            // MÓDULO 03
            "aula-11": () => progress.modulo02.teste.aprovado,
            "aula-12": () => progress.modulo03.aulas["aula-11"],
            "aula-13": () => progress.modulo03.aulas["aula-12"],
            "aula-14": () => progress.modulo03.aulas["aula-13"],
            "aula-15": () => progress.modulo03.aulas["aula-14"],
            "aula-16": () => progress.modulo03.aulas["aula-15"],

            // MÓDULO 04
            "aula-17": () => progress.modulo03.teste.aprovado,
            "aula-18": () => progress.modulo04.aulas["aula-17"],
            "aula-19": () => progress.modulo04.aulas["aula-18"],
            "aula-20": () => progress.modulo04.aulas["aula-19"],
            "aula-21": () => progress.modulo04.aulas["aula-20"],
            "aula-22": () => progress.modulo04.aulas["aula-21"],

            // MÓDULO 05
            "aula-23": () => progress.modulo04.teste.aprovado,
            "aula-24": () => progress.modulo05.aulas["aula-23"],
            "aula-25": () => progress.modulo05.aulas["aula-24"],
            "aula-26": () => progress.modulo05.aulas["aula-25"],
            "aula-27": () => progress.modulo05.aulas["aula-26"],
            "aula-28": () => progress.modulo05.aulas["aula-27"],

            // MÓDULO 06
            "aula-29": () => progress.modulo05.teste.aprovado,
            "aula-30": () => progress.modulo06.aulas["aula-29"],
            "aula-31": () => progress.modulo06.aulas["aula-30"],
            "aula-32": () => progress.modulo06.aulas["aula-31"],
            "aula-33": () => progress.modulo06.aulas["aula-32"],
            "aula-34": () => progress.modulo06.aulas["aula-33"]
        };

        return regras[aula]
            ? regras[aula]() === true
            : false;
    },

    // =====================================================
    // FUNÇÕES AUXILIARES DOS TESTES
    // =====================================================

    validarNota(nota) {
        const valor = Number(nota);

        if (!Number.isFinite(valor)) return 0;

        return Math.max(0, Math.min(100, valor));
    },

    guardarResultadoTeste(teste, nota, chaveAntiga) {
        const progress = this.getProgress();
        nota = this.validarNota(nota);

        teste.nota = nota;
        teste.concluido = true;
        teste.aprovado = nota >= 80;

        const guardado = this.saveProgress(progress);

        if (chaveAntiga) {
            try {
                if (teste.aprovado) {
                    localStorage.setItem(chaveAntiga, "true");
                } else {
                    localStorage.removeItem(chaveAntiga);
                }
            } catch (erro) {
                console.error("Erro ao atualizar aprovação:", erro);
            }
        }

        return guardado;
    },

    obterProgressoModulo(aulas, teste) {
        const progress = this.getProgress();

        const concluidas = aulas.filter(aula => {
            const modulo = this.obterModuloDaAula(aula);

            if (modulo === "modulo01") {
                return progress.aulas[aula] === true;
            }

            return progress[modulo].aulas[aula] === true;
        }).length + (teste.aprovado ? 1 : 0);

        const total = aulas.length + 1;

        return {
            concluidas,
            total,
            percentagem: Math.round((concluidas / total) * 100)
        };
    },

    // =====================================================
    // TESTE 01 — MÓDULO 01
    // =====================================================

    podeAbrirTeste01() {
        const p = this.getProgress();

        return [
            "aula-01", "aula-02", "aula-03", "aula-04"
        ].every(aula => p.aulas[aula] === true);
    },

    guardarResultadoTeste01(nota) {
        const p = this.getProgress();
        p.teste01.nota = this.validarNota(nota);
        p.teste01.concluido = true;
        p.teste01.aprovado = p.teste01.nota >= 80;

        return this.saveProgress(p);
    },

    teste01Aprovado() {
        return this.getProgress().teste01.aprovado === true;
    },

    obterProgressoModulo01() {
        const p = this.getProgress();

        const aulas = [
            "aula-01", "aula-02", "aula-03", "aula-04"
        ];

        const concluidas = aulas.filter(aula =>
            p.aulas[aula] === true
        ).length + (p.teste01.aprovado ? 1 : 0);

        return {
            concluidas,
            total: 5,
            percentagem: Math.round((concluidas / 5) * 100)
        };
    },

    modulo02Desbloqueado() {
        return this.teste01Aprovado();
    },

    // =====================================================
    // TESTE 02 — MÓDULO 02
    // =====================================================

    podeAbrirTeste02() {
        const p = this.getProgress();

        return Object.keys(p.modulo02.aulas).every(aula =>
            p.modulo02.aulas[aula] === true
        );
    },

    guardarResultadoTeste02(nota) {
        const p = this.getProgress();
        p.modulo02.teste.nota = this.validarNota(nota);
        p.modulo02.teste.concluido = true;
        p.modulo02.teste.aprovado = p.modulo02.teste.nota >= 80;

        return this.saveProgress(p);
    },

    teste02Aprovado() {
        return this.getProgress().modulo02.teste.aprovado === true;
    },

    obterProgressoModulo02() {
        const p = this.getProgress();
        return this.obterProgressoModulo(
            Object.keys(p.modulo02.aulas),
            p.modulo02.teste
        );
    },

    modulo03Desbloqueado() {
        return this.teste02Aprovado();
    },

    // =====================================================
    // TESTE 03 — MÓDULO 03
    // =====================================================

    podeAbrirTeste03() {
        const p = this.getProgress();

        return Object.keys(p.modulo03.aulas).every(aula =>
            p.modulo03.aulas[aula] === true
        );
    },

    guardarResultadoTeste03(nota) {
        const p = this.getProgress();
        p.modulo03.teste.nota = this.validarNota(nota);
        p.modulo03.teste.concluido = true;
        p.modulo03.teste.aprovado = p.modulo03.teste.nota >= 80;

        return this.saveProgress(p);
    },

    teste03Aprovado() {
        return this.getProgress().modulo03.teste.aprovado === true;
    },

    obterProgressoModulo03() {
        const p = this.getProgress();
        return this.obterProgressoModulo(
            Object.keys(p.modulo03.aulas),
            p.modulo03.teste
        );
    },

    modulo04Desbloqueado() {
        return this.teste03Aprovado();
    },

    // =====================================================
    // TESTE 04 — MÓDULO 04
    // =====================================================

    podeAbrirTeste04() {
        const p = this.getProgress();

        return Object.keys(p.modulo04.aulas).every(aula =>
            p.modulo04.aulas[aula] === true
        );
    },

    guardarResultadoTeste04(nota) {
        const p = this.getProgress();
        p.modulo04.teste.nota = this.validarNota(nota);
        p.modulo04.teste.concluido = true;
        p.modulo04.teste.aprovado = p.modulo04.teste.nota >= 80;

        this.saveProgress(p);

        try {
            if (p.modulo04.teste.aprovado) {
                localStorage.setItem("virtuscar_teste_04_aprovado", "true");
            } else {
                localStorage.removeItem("virtuscar_teste_04_aprovado");
            }
        } catch (erro) {
            console.error("Erro ao guardar Teste 04:", erro);
        }
    },

    teste04Aprovado() {
        return this.getProgress().modulo04.teste.aprovado === true;
    },

    obterProgressoModulo04() {
        const p = this.getProgress();
        return this.obterProgressoModulo(
            Object.keys(p.modulo04.aulas),
            p.modulo04.teste
        );
    },

    modulo05Desbloqueado() {
        return this.teste04Aprovado();
    },

    // =====================================================
    // TESTE 05 — MÓDULO 05
    // =====================================================

    podeAbrirTeste05() {
        const p = this.getProgress();

        return Object.keys(p.modulo05.aulas).every(aula =>
            p.modulo05.aulas[aula] === true
        );
    },

    guardarResultadoTeste05(nota) {
        const p = this.getProgress();
        p.modulo05.teste.nota = this.validarNota(nota);
        p.modulo05.teste.concluido = true;
        p.modulo05.teste.aprovado = p.modulo05.teste.nota >= 80;

        this.saveProgress(p);

        try {
            if (p.modulo05.teste.aprovado) {
                localStorage.setItem("virtuscar_teste_05_aprovado", "true");
            } else {
                localStorage.removeItem("virtuscar_teste_05_aprovado");
            }
        } catch (erro) {
            console.error("Erro ao guardar Teste 05:", erro);
        }
    },

    teste05Aprovado() {
        return this.getProgress().modulo05.teste.aprovado === true;
    },

    obterProgressoModulo05() {
        const p = this.getProgress();
        return this.obterProgressoModulo(
            Object.keys(p.modulo05.aulas),
            p.modulo05.teste
        );
    },

    modulo06Desbloqueado() {
        return this.teste05Aprovado();
    },

    // =====================================================
    // TESTE 06 — MÓDULO 06
    // =====================================================

    podeAbrirTeste06() {
        const p = this.getProgress();

        return Object.keys(p.modulo06.aulas).every(aula =>
            p.modulo06.aulas[aula] === true
        );
    },

    guardarResultadoTeste06(nota) {
        const p = this.getProgress();

        p.modulo06.teste.nota = this.validarNota(nota);
        p.modulo06.teste.concluido = true;
        p.modulo06.teste.aprovado = p.modulo06.teste.nota >= 80;

        const guardado = this.saveProgress(p);

        try {
            if (p.modulo06.teste.aprovado) {
                localStorage.setItem("virtuscar_teste_06_aprovado", "true");
            } else {
                localStorage.removeItem("virtuscar_teste_06_aprovado");
            }

            localStorage.setItem(
                "virtuscar_teste_06_nota",
                String(p.modulo06.teste.nota)
            );
        } catch (erro) {
            console.error("Erro ao guardar Teste 06:", erro);
        }

        return guardado;
    },

    teste06Aprovado() {
        return this.getProgress().modulo06.teste.aprovado === true;
    },

    obterProgressoModulo06() {
        const p = this.getProgress();

        return this.obterProgressoModulo(
            Object.keys(p.modulo06.aulas),
            p.modulo06.teste
        );
    },

    // =====================================================
    // PROGRESSO GERAL — MÓDULOS 01 A 06
    // =====================================================

    obterProgressoGeral() {
        const modulos = [
            this.obterProgressoModulo01(),
            this.obterProgressoModulo02(),
            this.obterProgressoModulo03(),
            this.obterProgressoModulo04(),
            this.obterProgressoModulo05(),
            this.obterProgressoModulo06()
        ];

        const concluidas = modulos.reduce(
            (total, modulo) => total + modulo.concluidas,
            0
        );

        const total = modulos.reduce(
            (soma, modulo) => soma + modulo.total,
            0
        );

        return {
            concluidas,
            total,
            percentagem: total > 0
                ? Math.round((concluidas / total) * 100)
                : 0
        };
    }

};

// Disponibilizar o sistema aos restantes ficheiros.
if (typeof window !== "undefined") {
    window.VirtusCarProgress = VirtusCarProgress;
}
