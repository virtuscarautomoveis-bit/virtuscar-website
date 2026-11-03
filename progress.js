
/* =========================================================
   VIRTUSCAR ACADEMY — SISTEMA DE PROGRESSO
   Módulos 01 a 06 | Aulas 01 a 34 | Testes 01 a 06
   ========================================================= */

const VirtusCarProgress = {
    STORAGE_KEY: "virtuscar_progress",
    NOTA_MINIMA: 80,

    MODULOS: {
        1: { nome: "modulo01", aulas: ["aula-01", "aula-02", "aula-03", "aula-04"] },
        2: { nome: "modulo02", aulas: ["aula-05", "aula-06", "aula-07", "aula-08", "aula-09", "aula-10"] },
        3: { nome: "modulo03", aulas: ["aula-11", "aula-12", "aula-13", "aula-14", "aula-15", "aula-16"] },
        4: { nome: "modulo04", aulas: ["aula-17", "aula-18", "aula-19", "aula-20", "aula-21", "aula-22"] },
        5: { nome: "modulo05", aulas: ["aula-23", "aula-24", "aula-25", "aula-26", "aula-27", "aula-28"] },
        6: { nome: "modulo06", aulas: ["aula-29", "aula-30", "aula-31", "aula-32", "aula-33", "aula-34"] }
    },

    criarTesteInicial() {
        return { concluido: false, nota: 0, aprovado: false };
    },

    criarProgressoInicial() {
        const p = { aulas: {}, teste01: this.criarTesteInicial() };

        Object.values(this.MODULOS).forEach((modulo, indice) => {
            const numero = indice + 1;
            const aulas = {};
            modulo.aulas.forEach(aula => aulas[aula] = false);

            if (numero === 1) {
                p.aulas = aulas;
            } else {
                p[modulo.nome] = {
                    aulas,
                    teste: this.criarTesteInicial()
                };
            }
        });

        return p;
    },

    getProgress() {
        const inicial = this.criarProgressoInicial();
        let guardado = null;

        try {
            guardado = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "null");
        } catch (erro) {
            console.error("Erro ao ler progresso:", erro);
        }

        const p = guardado && typeof guardado === "object" ? guardado : inicial;

        if (!p.aulas) p.aulas = {};
        if (!p.teste01) p.teste01 = this.criarTesteInicial();

        Object.keys(inicial.aulas).forEach(aula => {
            if (p.aulas[aula] === undefined) p.aulas[aula] = false;
        });

        Object.values(this.MODULOS).forEach((modulo, indice) => {
            const numero = indice + 1;
            if (numero === 1) return;

            if (!p[modulo.nome]) p[modulo.nome] = inicial[modulo.nome];
            if (!p[modulo.nome].aulas) p[modulo.nome].aulas = {};
            if (!p[modulo.nome].teste) p[modulo.nome].teste = this.criarTesteInicial();

            modulo.aulas.forEach(aula => {
                if (p[modulo.nome].aulas[aula] === undefined) {
                    p[modulo.nome].aulas[aula] = false;
                }
            });

            const teste = p[modulo.nome].teste;
            if (teste.concluido === undefined) teste.concluido = false;
            if (teste.nota === undefined) teste.nota = 0;
            if (teste.aprovado === undefined) teste.aprovado = false;
        });

        if (p.teste01.concluido === undefined) p.teste01.concluido = false;
        if (p.teste01.nota === undefined) p.teste01.nota = 0;
        if (p.teste01.aprovado === undefined) p.teste01.aprovado = false;

        // Recuperar registos antigos das aulas 01 a 34.
        Object.values(this.MODULOS).forEach(modulo => {
            modulo.aulas.forEach(aula => {
                const chave = "virtuscar_" + aula.replace("-", "_");
                if (localStorage.getItem(chave) === "true") {
                    this.definirAulaNoProgresso(p, aula, true);
                }
            });
        });

        // Recuperar aprovações antigas dos testes.
        for (let n = 1; n <= 6; n++) {
            if (localStorage.getItem(`virtuscar_teste_0${n}_aprovado`) === "true") {
                const teste = this.obterTeste(p, n);
                teste.concluido = true;
                teste.aprovado = true;
                if (!teste.nota) teste.nota = 80;
            }
        }

        this.saveProgress(p);
        return p;
    },

    saveProgress(progress) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
            return true;
        } catch (erro) {
            console.error("Erro ao guardar progresso:", erro);
            return false;
        }
    },

    obterTeste(p, numero) {
        return numero === 1 ? p.teste01 : p[`modulo0${numero}`].teste;
    },

    definirAulaNoProgresso(p, aula, valor) {
        if (p.aulas && p.aulas[aula] !== undefined) {
            p.aulas[aula] = valor;
            return true;
        }

        for (let n = 2; n <= 6; n++) {
            const modulo = p[`modulo0${n}`];
            if (modulo && modulo.aulas[aula] !== undefined) {
                modulo.aulas[aula] = valor;
                return true;
            }
        }
        return false;
    },

    concluirAula(aula) {
        const p = this.getProgress();
        const encontrada = this.definirAulaNoProgresso(p, aula, true);
        if (!encontrada) {
            console.warn("Aula não encontrada:", aula);
            return false;
        }

        try {
            localStorage.setItem("virtuscar_" + aula.replace("-", "_"), "true");
        } catch (erro) {
            console.error(erro);
        }

        return this.saveProgress(p);
    },

    aulaConcluida(aula) {
        const p = this.getProgress();

        if (p.aulas[aula] === true) return true;

        for (let n = 2; n <= 6; n++) {
            if (p[`modulo0${n}`].aulas[aula] === true) return true;
        }

        return localStorage.getItem("virtuscar_" + aula.replace("-", "_")) === "true";
    },

    aulasDoModuloConcluidas(numero) {
        return this.MODULOS[numero].aulas.every(aula => this.aulaConcluida(aula));
    },

    testeAprovado(numero) {
        const p = this.getProgress();
        return this.obterTeste(p, numero).aprovado === true;
    },

    guardarResultadoTeste(numero, nota) {
        const p = this.getProgress();
        const valor = this.validarNota(nota);
        const teste = this.obterTeste(p, numero);

        teste.nota = valor;
        teste.concluido = true;
        teste.aprovado = valor >= this.NOTA_MINIMA;

        this.saveProgress(p);

        const chave = `virtuscar_teste_0${numero}_aprovado`;
        try {
            if (teste.aprovado) {
                localStorage.setItem(chave, "true");
            } else {
                localStorage.removeItem(chave);
            }

            localStorage.setItem(`virtuscar_teste_0${numero}_nota`, String(valor));
        } catch (erro) {
            console.error("Erro ao guardar resultado do teste:", erro);
        }

        return teste.aprovado;
    },

    podeAbrirTeste(numero) {
        return this.aulasDoModuloConcluidas(numero);
    },

    podeAbrirAula(aula) {
        const p = this.getProgress();

        for (let n = 1; n <= 6; n++) {
            const aulas = this.MODULOS[n].aulas;
            const indice = aulas.indexOf(aula);
            if (indice === -1) continue;

            if (n === 1 && indice === 0) return true;
            if (n > 1 && indice === 0) return this.testeAprovado(n - 1);

            if (indice > 0) {
                return this.aulaConcluida(aulas[indice - 1]);
            }
        }
        return false;
    },

    moduloDesbloqueado(numero) {
        if (numero === 1) return true;
        return this.testeAprovado(numero - 1);
    },

    obterProgressoModulo(numero) {
        const modulo = this.MODULOS[numero];
        const aulasConcluidas = modulo.aulas.filter(aula => this.aulaConcluida(aula)).length;
        const testePassado = this.testeAprovado(numero) ? 1 : 0;
        const total = modulo.aulas.length + 1;
        const concluidas = aulasConcluidas + testePassado;

        return {
            concluidas,
            aulasConcluidas,
            testeAprovado: testePassado === 1,
            total,
            percentagem: Math.round((concluidas / total) * 100)
        };
    },

    obterProgressoModulo01() { return this.obterProgressoModulo(1); },
    obterProgressoModulo02() { return this.obterProgressoModulo(2); },
    obterProgressoModulo03() { return this.obterProgressoModulo(3); },
    obterProgressoModulo04() { return this.obterProgressoModulo(4); },
    obterProgressoModulo05() { return this.obterProgressoModulo(5); },
    obterProgressoModulo06() { return this.obterProgressoModulo(6); },

    podeAbrirTeste01() { return this.podeAbrirTeste(1); },
    podeAbrirTeste02() { return this.podeAbrirTeste(2); },
    podeAbrirTeste03() { return this.podeAbrirTeste(3); },
    podeAbrirTeste04() { return this.podeAbrirTeste(4); },
    podeAbrirTeste05() { return this.podeAbrirTeste(5); },
    podeAbrirTeste06() { return this.podeAbrirTeste(6); },

    guardarResultadoTeste01(nota) { return this.guardarResultadoTeste(1, nota); },
    guardarResultadoTeste02(nota) { return this.guardarResultadoTeste(2, nota); },
    guardarResultadoTeste03(nota) { return this.guardarResultadoTeste(3, nota); },
    guardarResultadoTeste04(nota) { return this.guardarResultadoTeste(4, nota); },
    guardarResultadoTeste05(nota) { return this.guardarResultadoTeste(5, nota); },
    guardarResultadoTeste06(nota) { return this.guardarResultadoTeste(6, nota); },

    teste01Aprovado() { return this.testeAprovado(1); },
    teste02Aprovado() { return this.testeAprovado(2); },
    teste03Aprovado() { return this.testeAprovado(3); },
    teste04Aprovado() { return this.testeAprovado(4); },
    teste05Aprovado() { return this.testeAprovado(5); },
    teste06Aprovado() { return this.testeAprovado(6); },

    modulo02Desbloqueado() { return this.moduloDesbloqueado(2); },
    modulo03Desbloqueado() { return this.moduloDesbloqueado(3); },
    modulo04Desbloqueado() { return this.moduloDesbloqueado(4); },
    modulo05Desbloqueado() { return this.moduloDesbloqueado(5); },
    modulo06Desbloqueado() { return this.moduloDesbloqueado(6); },

    obterProgressoGeral() {
        const modulos = [1, 2, 3, 4, 5, 6].map(n => this.obterProgressoModulo(n));
        const concluidas = modulos.reduce((soma, m) => soma + m.concluidas, 0);
        const total = modulos.reduce((soma, m) => soma + m.total, 0);

        return {
            concluidas,
            total,
            percentagem: Math.round((concluidas / total) * 100)
        };
    },

    validarNota(nota) {
        const valor = Number(nota);
        if (!Number.isFinite(valor)) return 0;
        return Math.max(0, Math.min(100, valor));
    }
};

if (typeof window !== "undefined") {
    window.VirtusCarProgress = VirtusCarProgress;
}
