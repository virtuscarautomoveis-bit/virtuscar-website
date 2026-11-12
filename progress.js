/* ==========================================================
   VIRTUSCAR — ACADEMIA
   Sistema de progresso individual com Supabase
   ========================================================== */

(function () {
    "use strict";

    const SUPABASE_URL = "https://aqmmccpfteiwdgkryctc.supabase.co";

    const SUPABASE_KEY = "sb_publishable_qGR9J2lL_5cOjY5JCYoK2A_PcUy4UnK";

    const MAPA_MODULOS = {
        modulo01: [
            "aula-01",
            "aula-02",
            "aula-03",
            "aula-04"
        ],

        modulo02: [
            "aula-05",
            "aula-06",
            "aula-07",
            "aula-08",
            "aula-09",
            "aula-10"
        ],

        modulo03: [
            "aula-11",
            "aula-12",
            "aula-13",
            "aula-14",
            "aula-15",
            "aula-16"
        ],

        modulo04: [
            "aula-17",
            "aula-18",
            "aula-19",
            "aula-20",
            "aula-21",
            "aula-22"
        ],

        modulo05: [
            "aula-23",
            "aula-24",
            "aula-25",
            "aula-26",
            "aula-27",
            "aula-28"
        ],

        modulo06: [
            "aula-29",
            "aula-30",
            "aula-31",
            "aula-32",
            "aula-33",
            "aula-34"
        ]
    };

    /* ======================================================
       ESTRUTURA INICIAL DO PROGRESSO
       ====================================================== */

    function criarProgressoInicial() {
        return {
            aulas: Object.fromEntries(
                MAPA_MODULOS.modulo01.map(aula => [aula, false])
            ),

            teste01: {
                concluido: false,
                nota: 0,
                aprovado: false
            },

            ...Object.fromEntries(
                Object.entries(MAPA_MODULOS)
                    .filter(([nome]) => nome !== "modulo01")
                    .map(([nome, aulas]) => [
                        nome,
                        {
                            aulas: Object.fromEntries(
                                aulas.map(aula => [aula, false])
                            ),

                            teste: {
                                concluido: false,
                                nota: 0,
                                aprovado: false
                            }
                        }
                    ])
            )
        };
    }

    /* ======================================================
       SISTEMA PRINCIPAL
       ====================================================== */

    const VP = {

        supabase: null,
        user: null,
        progress: criarProgressoInicial(),
        pronto: false,

        /* ==================================================
           INICIALIZAÇÃO E AUTENTICAÇÃO
           ================================================== */

        async inicializar() {
            try {
                const { createClient } = await import(
                    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
                );

                this.supabase = createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );

                const { data, error } =
                    await this.supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                if (!data.session || !data.session.user) {
                    window.location.replace("login.html");

                    throw new Error("Sessão não encontrada.");
                }

                this.user = data.session.user;

                await this.carregarDoSupabase();

                this.pronto = true;

                this.supabase.auth.onAuthStateChange(
                    (event, session) => {
                        if (
                            event === "SIGNED_OUT" ||
                            !session?.user
                        ) {
                            window.location.replace("login.html");
                        }
                    }
                );

                return this.progress;

            } catch (error) {
                console.error(
                    "Erro ao inicializar o progresso:",
                    error
                );

                throw error;
            }
        },

        /* ==================================================
           IDENTIFICAÇÃO DOS MÓDULOS
           ================================================== */

        obterModuloDaAula(aula) {
            return Object.keys(MAPA_MODULOS).find(
                modulo => MAPA_MODULOS[modulo].includes(aula)
            ) || null;
        },

        obterObjetoTeste(numero, progresso = this.progress) {
            if (numero === 1) {
                return progresso.teste01;
            }

            return progresso["modulo0" + numero]?.teste || null;
        },

        obterObjetoAulas(modulo, progresso = this.progress) {
            if (modulo === "modulo01") {
                return progresso.aulas;
            }

            return progresso[modulo]?.aulas || null;
        },

        /* ==================================================
           REGRAS DE APROVAÇÃO
           ================================================== */

        notaMinima(numero) {
            return numero === 5 ? 70 : 80;
        },

        validarNota(nota) {
            nota = Number(nota);

            if (!Number.isFinite(nota)) {
                return 0;
            }

            return Math.max(0, Math.min(100, nota));
        },

        /* ==================================================
           CARREGAR PROGRESSO DO SUPABASE
           ================================================== */

        async carregarDoSupabase() {
            const { data, error } = await this.supabase
                .from("academy_progress")
                .select("item_key, completed, score")
                .eq("consultant_id", this.user.id);

            if (error) {
                throw error;
            }

            const progresso = criarProgressoInicial();

            (data || []).forEach(registo => {

                const modulo = this.obterModuloDaAula(
                    registo.item_key
                );

                if (modulo) {
                    const aulas = this.obterObjetoAulas(
                        modulo,
                        progresso
                    );

                    if (aulas) {
                        aulas[registo.item_key] =
                            registo.completed === true;
                    }

                    return;
                }

                const correspondencia = String(
                    registo.item_key || ""
                ).match(/^teste-0([1-6])$/);

                if (correspondencia) {
                    const numero = Number(
                        correspondencia[1]
                    );

                    const teste = this.obterObjetoTeste(
                        numero,
                        progresso
                    );

                    if (!teste) {
                        return;
                    }

                    teste.concluido =
                        registo.completed === true;

                    teste.nota = this.validarNota(
                        registo.score ?? 0
                    );

                    teste.aprovado =
                        teste.concluido &&
                        teste.nota >= this.notaMinima(numero);
                }
            });

            this.progress = progresso;

            return progresso;
        },

        /* ==================================================
           CONSULTAR PROGRESSO
           ================================================== */

        getProgress() {
            return this.progress;
        },

        /* ==================================================
           GUARDAR REGISTO NO SUPABASE
           ================================================== */

        async guardarItem(chave, concluido, nota = null) {
            if (!this.pronto || !this.user) {
                throw new Error(
                    "O progresso ainda não foi inicializado."
                );
            }

            const { error } = await this.supabase
                .from("academy_progress")
                .upsert(
                    {
                        consultant_id: this.user.id,
                        item_key: chave,
                        completed: Boolean(concluido),
                        score: nota === null
                            ? null
                            : this.validarNota(nota),
                        completed_at: concluido
                            ? new Date().toISOString()
                            : null
                    },
                    {
                        onConflict: "consultant_id,item_key"
                    }
                );

            if (error) {
                throw error;
            }

            return true;
        },

        /* ==================================================
           CONCLUIR AULAS
           ================================================== */

        async concluirAula(aula) {
            const modulo = this.obterModuloDaAula(aula);

            const aulas = this.obterObjetoAulas(modulo);

            if (!aulas || !(aula in aulas)) {
                throw new Error("Aula inválida: " + aula);
            }

            await this.guardarItem(aula, true);

            aulas[aula] = true;

            return true;
        },

        aulaConcluida(aula) {
            const modulo = this.obterModuloDaAula(aula);

            const aulas = this.obterObjetoAulas(modulo);

            return Boolean(
                aulas && aulas[aula] === true
            );
        },

        /* ==================================================
           VERIFICAR SE UMA AULA PODE SER ABERTA
           ================================================== */

        podeAbrirAula(aula) {
            const correspondencia = String(aula).match(/\d+/);

            const numero = correspondencia
                ? Number(correspondencia[0])
                : 0;

            if (!numero || numero < 1 || numero > 34) {
                return false;
            }

            if (numero === 1) {
                return true;
            }

            const desbloqueios = {
                5: 1,
                11: 2,
                17: 3,
                23: 4,
                29: 5
            };

            if (desbloqueios[numero]) {
                const testeAnterior = desbloqueios[numero];

                return this[
                    "teste0" + testeAnterior + "Aprovado"
                ]();
            }

            const aulaAnterior =
                "aula-" + String(numero - 1).padStart(2, "0");

            return this.aulaConcluida(aulaAnterior);
        },

        /* ==================================================
           GUARDAR RESULTADOS DOS TESTES
           ================================================== */

        async guardarResultadoTeste(numero, nota) {
            const teste = this.obterObjetoTeste(numero);

            if (!teste) {
                throw new Error("Teste inválido.");
            }

            nota = this.validarNota(nota);

            const aprovado =
                nota >= this.notaMinima(numero);

            await this.guardarItem(
                "teste-0" + numero,
                true,
                nota
            );

            teste.nota = nota;
            teste.concluido = true;
            teste.aprovado = aprovado;

            return {
                nota: nota,
                aprovado: aprovado
            };
        },

        async guardarResultadoTeste01(nota) {
            return this.guardarResultadoTeste(1, nota);
        },

        async guardarResultadoTeste02(nota) {
            return this.guardarResultadoTeste(2, nota);
        },

        async guardarResultadoTeste03(nota) {
            return this.guardarResultadoTeste(3, nota);
        },

        async guardarResultadoTeste04(nota) {
            return this.guardarResultadoTeste(4, nota);
        },

        async guardarResultadoTeste05(nota) {
            return this.guardarResultadoTeste(5, nota);
        },

        async guardarResultadoTeste06(nota) {
            return this.guardarResultadoTeste(6, nota);
        },

        /* ==================================================
           VERIFICAR APROVAÇÃO NOS TESTES
           ================================================== */

        teste01Aprovado() {
            return this.progress.teste01.aprovado === true;
        },

        teste02Aprovado() {
            return this.progress.modulo02.teste.aprovado === true;
        },

        teste03Aprovado() {
            return this.progress.modulo03.teste.aprovado === true;
        },

        teste04Aprovado() {
            return this.progress.modulo04.teste.aprovado === true;
        },

        teste05Aprovado() {
            return this.progress.modulo05.teste.aprovado === true;
        },

        teste06Aprovado() {
            return this.progress.modulo06.teste.aprovado === true;
        },

        /* ==================================================
           DESBLOQUEAR MÓDULOS
           ================================================== */

        modulo02Desbloqueado() {
            return this.teste01Aprovado();
        },

        modulo03Desbloqueado() {
            return this.teste02Aprovado();
        },

        modulo04Desbloqueado() {
            return this.teste03Aprovado();
        },

        modulo05Desbloqueado() {
            return this.teste04Aprovado();
        },

        modulo06Desbloqueado() {
            return this.teste05Aprovado();
        },

        /* ==================================================
           VERIFICAR ACESSO AOS TESTES
           ================================================== */

        podeAbrirTeste01() {
            return MAPA_MODULOS.modulo01.every(
                aula => this.aulaConcluida(aula)
            );
        },

        podeAbrirTeste02() {
            return MAPA_MODULOS.modulo02.every(
                aula => this.aulaConcluida(aula)
            );
        },

        podeAbrirTeste03() {
            return MAPA_MODULOS.modulo03.every(
                aula => this.aulaConcluida(aula)
            );
        },

        podeAbrirTeste04() {
            return MAPA_MODULOS.modulo04.every(
                aula => this.aulaConcluida(aula)
            );
        },

        podeAbrirTeste05() {
            return MAPA_MODULOS.modulo05.every(
                aula => this.aulaConcluida(aula)
            );
        },

        podeAbrirTeste06() {
            return MAPA_MODULOS.modulo06.every(
                aula => this.aulaConcluida(aula)
            );
        },

        /* ==================================================
           PROGRESSO DE CADA MÓDULO
           ================================================== */

        obterProgressoModulo(numero) {
            const chave = "modulo0" + numero;

            const aulas = MAPA_MODULOS[chave] ||
                MAPA_MODULOS.modulo01;

            const teste = this.obterObjetoTeste(numero);

            const aulasConcluidas = aulas.filter(
                aula => this.aulaConcluida(aula)
            ).length;

            const testeConcluido =
                teste && teste.aprovado ? 1 : 0;

            const concluidas =
                aulasConcluidas + testeConcluido;

            const total = aulas.length + 1;

            return {
                concluidas: concluidas,
                total: total,
                percentagem: Math.round(
                    (concluidas / total) * 100
                )
            };
        },

        obterProgressoModulo01() {
            return this.obterProgressoModulo(1);
        },

        obterProgressoModulo02() {
            return this.obterProgressoModulo(2);
        },

        obterProgressoModulo03() {
            return this.obterProgressoModulo(3);
        },

        obterProgressoModulo04() {
            return this.obterProgressoModulo(4);
        },

        obterProgressoModulo05() {
            return this.obterProgressoModulo(5);
        },

        obterProgressoModulo06() {
            return this.obterProgressoModulo(6);
        },

        /* ==================================================
           PROGRESSO GERAL DA ACADEMIA
           ================================================== */

        obterProgressoGeral() {
            const modulos = [1, 2, 3, 4, 5, 6].map(
                numero => this.obterProgressoModulo(numero)
            );

            const concluidas = modulos.reduce(
                (total, modulo) => total + modulo.concluidas,
                0
            );

            const total = modulos.reduce(
                (soma, modulo) => soma + modulo.total,
                0
            );

            return {
                concluidas: concluidas,
                total: total,
                percentagem: Math.round(
                    (concluidas / total) * 100
                )
            };
        }
    };

    /* ======================================================
       DISPONIBILIZAR SISTEMA PARA TODAS AS PÁGINAS
       ====================================================== */

    window.VirtusCarProgress = VP;

})();
