/* =========================================================
   VIRTUSCAR ACADEMY — SISTEMA DE PROGRESSO
   Versão corrigida
   ========================================================= */

const VirtusCarProgress = {

    STORAGE_KEY: "virtuscar_progress",

    // =====================================================
    // ESTRUTURA INICIAL DO PROGRESSO
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

            modulo02: {
                aulas: {
                    "aula-05": false,
                    "aula-06": false,
                    "aula-07": false,
                    "aula-08": false,
                    "aula-09": false,
                    "aula-10": false
                },
                teste: {
                    concluido: false,
                    nota: 0,
                    aprovado: false
                }
            },

            modulo03: {
                aulas: {
                    "aula-11": false,
                    "aula-12": false,
                    "aula-13": false,
                    "aula-14": false,
                    "aula-15": false,
                    "aula-16": false
                },
                teste: {
                    concluido: false,
                    nota: 0,
                    aprovado: false
                }
            },

            modulo04: {
                aulas: {
                    "aula-17": false,
                    "aula-18": false,
                    "aula-19": false,
                    "aula-20": false,
                    "aula-21": false,
                    "aula-22": false
                },
                teste: {
                    concluido: false,
                    nota: 0,
                    aprovado: false
                }
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

        // Garantir que existem todas as estruturas.
        if (!progress.aulas) progress.aulas = {};
        if (!progress.teste01) {
            progress.teste01 = { concluido: false, nota: 0, aprovado: false };
        }

        ["modulo02", "modulo03", "modulo04"].forEach(modulo => {
            if (!progress[modulo]) {
                progress[modulo] = inicial[modulo];
            }

            if (!progress[modulo].aulas) {
                progress[modulo].aulas = {};
            }

            if (!progress[modulo].teste) {
                progress[modulo].teste = {
                    concluido: false,
                    nota: 0,
                    aprovado: false
                };
            }
        });

        // Garantir que todas as aulas existem sem apagar o progresso.
        Object.keys(inicial.aulas).forEach(aula => {
            if (progress.aulas[aula] === undefined) {
                progress.aulas[aula] = false;
            }
        });

        ["modulo02", "modulo03", "modulo04"].forEach(modulo => {
            Object.keys(inicial[modulo].aulas).forEach(aula => {
                if (progress[modulo].aulas[aula] === undefined) {
                    progress[modulo].aulas[aula] = false;
                }
            });
        });

        // Completar os dados dos testes.
        const testes = [
            progress.teste01,
            progress.modulo02.teste,
            progress.modulo03.teste,
            progress.modulo04.teste
        ];

        testes.forEach(teste => {
            if (teste.concluido === undefined) teste.concluido = false;
            if (teste.nota === undefined) teste.nota = 0;
            if (teste.aprovado === undefined) teste.aprovado = false;
        });

        // Migrar dados antigos, caso existam.
        if (localStorage.getItem("virtuscar_aula_21") === "true") {
            progress.modulo04.aulas["aula-21"] = true;
        }

        if (localStorage.getItem("virtuscar_aula_22") === "true") {
            progress.modulo04.aulas["aula-22"] = true;
        }

        if (localStorage.getItem("virtuscar_teste_04_aprovado") === "true") {
            progress.modulo04.teste.concluido = true;
            progress.modulo04.teste.aprovado = true;

            if (!progress.modulo04.teste.nota) {
                progress.modulo04.teste.nota = 80;
            }
        }

        this.saveProgress(progress);
        return progress;
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

        if (progress.aulas[aula] !== undefined) {
            progress.aulas[aula] = true;
        }

        ["modulo02", "modulo03", "modulo04"].forEach(modulo => {
            if (progress[modulo].aulas[aula] !== undefined) {
                progress[modulo].aulas[aula] = true;
            }
        });

        this.saveProgress(progress);
    },

    aulaConcluida(aula) {
        const progress = this.getProgress();

        if (progress.aulas[aula] !== undefined) {
            return progress.aulas[aula] === true;
        }

        for (const modulo of ["modulo02", "modulo03", "modulo04"]) {
            if (progress[modulo].aulas[aula] !== undefined) {
                return progress[modulo].aulas[aula] === true;
            }
        }

        return false;
    },

    // =====================================================
    // VERIFICAR SE UMA AULA PODE SER ABERTA
    // =====================================================

    podeAbrirAula(aula) {
        const progress = this.getProgress();

        const regras = {
            "aula-01": () => true,
            "aula-02": () => progress.aulas["aula-01"],
            "aula-03": () => progress.aulas["aula-02"],
            "aula-04": () => progress.aulas["aula-03"],

            "aula-05": () => progress.teste01.aprovado,
            "aula-06": () => progress.modulo02.aulas["aula-05"],
            "aula-07": () => progress.modulo02.aulas["aula-06"],
            "aula-08": () => progress.modulo02.aulas["aula-07"],
            "aula-09": () => progress.modulo02.aulas["aula-08"],
            "aula-10": () => progress.modulo02.aulas["aula-09"],

            "aula-11": () => progress.modulo02.teste.aprovado,
            "aula-12": () => progress.modulo03.aulas["aula-11"],
            "aula-13": () => progress.modulo03.aulas["aula-12"],
            "aula-14": () => progress.modulo03.aulas["aula-13"],
            "aula-15": () => progress.modulo03.aulas["aula-14"],
            "aula-16": () => progress.modulo03.aulas["aula-15"],

            "aula-17": () => progress.modulo03.teste.aprovado,
            "aula-18": () => progress.modulo04.aulas["aula-17"],
            "aula-19": () => progress.modulo04.aulas["aula-18"],
            "aula-20": () => progress.modulo04.aulas["aula-19"],
            "aula-21": () => progress.modulo04.aulas["aula-20"],
            "aula-22": () => progress.modulo04.aulas["aula-21"]
        };

        return regras[aula] ? regras[aula]() === true : false;
    },

    // =====================================================
    // TESTE 01
    // =====================================================

    podeAbrirTeste01() {
        const p = this.getProgress();

        return [
            "aula-01", "aula-02", "aula-03", "aula-04"
        ].every(aula => p.aulas[aula] === true);
    },

    guardarResultadoTeste01(nota) {
        const p = this.getProgress();
        nota = this.validarNota(nota);

        p.teste01.nota = nota;
        p.teste01.concluido = true;
        p.teste01.aprovado = nota >= 80;

        this.saveProgress(p);
    },

    teste01Aprovado() {
        return this.getProgress().teste01.aprovado === true;
    },

    obterProgressoModulo01() {
        const p = this.getProgress();

        const concluidas = [
            "aula-01", "aula-02", "aula-03", "aula-04"
        ].filter(aula => p.aulas[aula] === true).length
            + (p.teste01.aprovado ? 1 : 0);

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
    // TESTE 02
    // =====================================================

    podeAbrirTeste02() {
        const p = this.getProgress();

        return [
            "aula-05", "aula-06", "aula-07",
            "aula-08", "aula-09", "aula-10"
        ].every(aula => p.modulo02.aulas[aula] === true);
    },

    guardarResultadoTeste02(nota) {
        const p = this.getProgress();
        nota = this.validarNota(nota);

        p.modulo02.teste.nota = nota;
        p.modulo02.teste.concluido = true;
        p.modulo02.teste.aprovado = nota >= 80;

        this.saveProgress(p);
    },

    teste02Aprovado() {
        return this.getProgress().modulo02.teste.aprovado === true;
    },

    obterProgressoModulo02() {
        const p = this.getProgress();

        const concluidas = [
            "aula-05", "aula-06", "aula-07",
            "aula-08", "aula-09", "aula-10"
        ].filter(aula => p.modulo02.aulas[aula] === true).length
            + (p.modulo02.teste.aprovado ? 1 : 0);

        return {
            concluidas,
            total: 7,
            percentagem: Math.round((concluidas / 7) * 100)
        };
    },

    modulo03Desbloqueado() {
        return this.teste02Aprovado();
    },

    // =====================================================
    // TESTE 03
    // =====================================================

    podeAbrirTeste03() {
        const p = this.getProgress();

        return [
            "aula-11", "aula-12", "aula-13",
            "aula-14", "aula-15", "aula-16"
        ].every(aula => p.modulo03.aulas[aula] === true);
    },

    guardarResultadoTeste03(nota) {
        const p = this.getProgress();
        nota = this.validarNota(nota);

        p.modulo03.teste.nota = nota;
        p.modulo03.teste.concluido = true;
        p.modulo03.teste.aprovado = nota >= 80;

        this.saveProgress(p);
    },

    teste03Aprovado() {
        return this.getProgress().modulo03.teste.aprovado === true;
    },

    obterProgressoModulo03() {
        const p = this.getProgress();

        const concluidas = [
            "aula-11", "aula-12", "aula-13",
            "aula-14", "aula-15", "aula-16"
        ].filter(aula => p.modulo03.aulas[aula] === true).length
            + (p.modulo03.teste.aprovado ? 1 : 0);

        return {
            concluidas,
            total: 7,
            percentagem: Math.round((concluidas / 7) * 100)
        };
    },

    modulo04Desbloqueado() {
        return this.teste03Aprovado();
    },

    // =====================================================
    // TESTE 04
    // =====================================================

    podeAbrirTeste04() {
        const p = this.getProgress();

        return [
            "aula-17", "aula-18", "aula-19",
            "aula-20", "aula-21", "aula-22"
        ].every(aula => p.modulo04.aulas[aula] === true);
    },

    guardarResultadoTeste04(nota) {
        const p = this.getProgress();
        nota = this.validarNota(nota);

        p.modulo04.teste.nota = nota;
        p.modulo04.teste.concluido = true;
        p.modulo04.teste.aprovado = nota >= 80;

        this.saveProgress(p);
    },

    teste04Aprovado() {
        return this.getProgress().modulo04.teste.aprovado === true;
    },

    obterProgressoModulo04() {
        const p = this.getProgress();

        const concluidas = [
            "aula-17", "aula-18", "aula-19",
            "aula-20", "aula-21", "aula-22"
        ].filter(aula => p.modulo04.aulas[aula] === true).length
            + (p.modulo04.teste.aprovado ? 1 : 0);

        return {
            concluidas,
            total: 7,
            percentagem: Math.round((concluidas / 7) * 100)
        };
    },

    modulo05Desbloqueado() {
        return this.teste04Aprovado();
    },

    // =====================================================
    // PROGRESSO GERAL
    // =====================================================

    obterProgressoGeral() {
        const modulos = [
            this.obterProgressoModulo01(),
            this.obterProgressoModulo02(),
            this.obterProgressoModulo03(),
            this.obterProgressoModulo04()
        ];

        const concluidas = modulos.reduce(
            (total, modulo) => total + modulo.concluidas, 0
        );

        const total = modulos.reduce(
            (soma, modulo) => soma + modulo.total, 0
        );

        return {
            concluidas,
            total,
            percentagem: total > 0
                ? Math.round((concluidas / total) * 100)
                : 0
        };
    },

    // =====================================================
    // VALIDAR NOTA DO TESTE
    // =====================================================

    validarNota(nota) {
        const valor = Number(nota);

        if (!Number.isFinite(valor)) return 0;

        return Math.max(0, Math.min(100, valor));
    }
};

// Disponibilizar o sistema aos restantes ficheiros da Academia.
window.VirtusCarProgress = VirtusCarProgress;
