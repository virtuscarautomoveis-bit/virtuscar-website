const VirtusCarProgress = {

    getProgress() {

        const saved = localStorage.getItem("virtuscar_progress");

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // =========================
                // MÓDULO 01
                // =========================

                if (!parsed.aulas) parsed.aulas = {};

                const modulo01Aulas = [
                    "aula-01",
                    "aula-02",
                    "aula-03",
                    "aula-04"
                ];

                modulo01Aulas.forEach(function(aula) {
                    if (parsed.aulas[aula] === undefined) {
                        parsed.aulas[aula] = false;
                    }
                });

                if (!parsed.teste01) {
                    parsed.teste01 = {
                        concluido: false,
                        nota: 0,
                        aprovado: false
                    };
                }

                // =========================
                // MÓDULO 02
                // =========================

                if (!parsed.modulo02) {
                    parsed.modulo02 = {
                        aulas: {},
                        teste: {
                            concluido: false,
                            nota: 0,
                            aprovado: false
                        }
                    };
                }

                if (!parsed.modulo02.aulas) {
                    parsed.modulo02.aulas = {};
                }

                const modulo02Aulas = [
                    "aula-05",
                    "aula-06",
                    "aula-07",
                    "aula-08",
                    "aula-09",
                    "aula-10"
                ];

                modulo02Aulas.forEach(function(aula) {
                    if (parsed.modulo02.aulas[aula] === undefined) {
                        parsed.modulo02.aulas[aula] = false;
                    }
                });

                if (!parsed.modulo02.teste) {
                    parsed.modulo02.teste = {
                        concluido: false,
                        nota: 0,
                        aprovado: false
                    };
                }

                // =========================
                // MÓDULO 03
                // =========================

                if (!parsed.modulo03) {
                    parsed.modulo03 = {
                        aulas: {},
                        teste: {
                            concluido: false,
                            nota: 0,
                            aprovado: false
                        }
                    };
                }

                if (!parsed.modulo03.aulas) {
                    parsed.modulo03.aulas = {};
                }

                const modulo03Aulas = [
                    "aula-11",
                    "aula-12",
                    "aula-13",
                    "aula-14",
                    "aula-15",
                    "aula-16"
                ];

                modulo03Aulas.forEach(function(aula) {
                    if (parsed.modulo03.aulas[aula] === undefined) {
                        parsed.modulo03.aulas[aula] = false;
                    }
                });

                if (!parsed.modulo03.teste) {
                    parsed.modulo03.teste = {
                        concluido: false,
                        nota: 0,
                        aprovado: false
                    };
                }

                // =========================
                // MÓDULO 04
                // =========================

                if (!parsed.modulo04) {
                    parsed.modulo04 = {
                        aulas: {},
                        teste: {
                            concluido: false,
                            nota: 0,
                            aprovado: false
                        }
                    };
                }

                if (!parsed.modulo04.aulas) {
                    parsed.modulo04.aulas = {};
                }

                const modulo04Aulas = [
                    "aula-17",
                    "aula-18",
                    "aula-19",
                    "aula-20",
                    "aula-21",
                    "aula-22"
                ];

                modulo04Aulas.forEach(function(aula) {
                    if (parsed.modulo04.aulas[aula] === undefined) {
                        parsed.modulo04.aulas[aula] = false;
                    }
                });

                if (!parsed.modulo04.teste) {
                    parsed.modulo04.teste = {
                        concluido: false,
                        nota: 0,
                        aprovado: false
                    };
                }

                // =========================
                // MIGRAÇÃO MÓDULO 04
                // =========================

                if (
                    localStorage.getItem("virtuscar_aula_21") === "true"
                ) {
                    parsed.modulo04.aulas["aula-21"] = true;
                }

                if (
                    localStorage.getItem("virtuscar_aula_22") === "true"
                ) {
                    parsed.modulo04.aulas["aula-22"] = true;
                }

                if (
                    localStorage.getItem("virtuscar_teste_04_aprovado") === "true"
                ) {
                    parsed.modulo04.teste.concluido = true;
                    parsed.modulo04.teste.aprovado = true;

                    if (!parsed.modulo04.teste.nota) {
                        parsed.modulo04.teste.nota = 80;
                    }
                }

                localStorage.setItem(
                    "virtuscar_progress",
                    JSON.stringify(parsed)
                );

                return parsed;

            } catch (error) {
                console.error(
                    "Erro ao carregar progresso:",
                    error
                );
            }
        }

        // =========================
        // ESTRUTURA INICIAL
        // =========================

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


    // =========================
    // GUARDAR PROGRESSO
    // =========================

    saveProgress(progress) {
        localStorage.setItem(
            "virtuscar_progress",
            JSON.stringify(progress)
        );
    },


    // =========================
    // CONCLUIR AULA
    // =========================

    concluirAula(aula) {

        const progress = this.getProgress();

        // Módulo 01
        if (
            progress.aulas &&
            progress.aulas[aula] !== undefined
        ) {
            progress.aulas[aula] = true;
        }

        // Módulo 02
        if (
            progress.modulo02 &&
            progress.modulo02.aulas &&
            progress.modulo02.aulas[aula] !== undefined
        ) {
            progress.modulo02.aulas[aula] = true;
        }

        // Módulo 03
        if (
            progress.modulo03 &&
            progress.modulo03.aulas &&
            progress.modulo03.aulas[aula] !== undefined
        ) {
            progress.modulo03.aulas[aula] = true;
        }

        // Módulo 04
        if (
            progress.modulo04 &&
            progress.modulo04.aulas &&
            progress.modulo04.aulas[aula] !== undefined
        ) {
            progress.modulo04.aulas[aula] = true;
        }

        this.saveProgress(progress);
    },


    // =========================
    // VERIFICAR AULA CONCLUÍDA
    // =========================

    aulaConcluida(aula) {

        const progress = this.getProgress();

        // Módulo 04
        if (
            progress.modulo04 &&
            progress.modulo04.aulas &&
            progress.modulo04.aulas[aula] !== undefined
        ) {
            return progress.modulo04.aulas[aula] === true;
        }

        // Módulo 03
        if (
            progress.modulo03 &&
            progress.modulo03.aulas &&
            progress.modulo03.aulas[aula] !== undefined
        ) {
            return progress.modulo03.aulas[aula] === true;
        }

        // Módulo 02
        if (
            progress.modulo02 &&
            progress.modulo02.aulas &&
            progress.modulo02.aulas[aula] !== undefined
        ) {
            return progress.modulo02.aulas[aula] === true;
        }

        // Módulo 01
        return (
            progress.aulas &&
            progress.aulas[aula] === true
        );
    },


    // =========================
    // PODE ABRIR AULA
    // =========================

    podeAbrirAula(aula) {

        const progress = this.getProgress();

        switch (aula) {

            // =========================
            // MÓDULO 01
            // =========================

            case "aula-01":

                return true;


            case "aula-02":

                return (
                    progress.aulas["aula-01"] === true
                );


            case "aula-03":

                return (
                    progress.aulas["aula-02"] === true
                );


            case "aula-04":

                return (
                    progress.aulas["aula-03"] === true
                );


            // =========================
            // MÓDULO 02
            // =========================

            case "aula-05":

                return (
                    progress.teste01 &&
                    progress.teste01.aprovado === true
                );


            case "aula-06":

                return (
                    progress.modulo02.aulas["aula-05"] === true
                );


            case "aula-07":

                return (
                    progress.modulo02.aulas["aula-06"] === true
                );


            case "aula-08":

                return (
                    progress.modulo02.aulas["aula-07"] === true
                );


            case "aula-09":

                return (
                    progress.modulo02.aulas["aula-08"] === true
                );


            case "aula-10":

                return (
                    progress.modulo02.aulas["aula-09"] === true
                );


            // =========================
            // MÓDULO 03
            // =========================

            case "aula-11":

                return (
                    progress.modulo02 &&
                    progress.modulo02.teste &&
                    progress.modulo02.teste.aprovado === true
                );


            case "aula-12":

                return (
                    progress.modulo03.aulas["aula-11"] === true
                );


            case "aula-13":

                return (
                    progress.modulo03.aulas["aula-12"] === true
                );


            case "aula-14":

                return (
                    progress.modulo03.aulas["aula-13"] === true
                );


            case "aula-15":

                return (
                    progress.modulo03.aulas["aula-14"] === true
                );


            case "aula-16":

                return (
                    progress.modulo03.aulas["aula-15"] === true
                );


            // =========================
            // MÓDULO 04
            // =========================

            case "aula-17":

                return (
                    progress.modulo03 &&
                    progress.modulo03.teste &&
                    progress.modulo03.teste.aprovado === true
                );


            case "aula-18":

                return (
                    progress.modulo04.aulas["aula-17"] === true
                );


            case "aula-19":

                return (
                    progress.modulo04.aulas["aula-18"] === true
                );


            case "aula-20":

                return (
                    progress.modulo04.aulas["aula-19"] === true
                );


            case "aula-21":

                return (
                    progress.modulo04.aulas["aula-20"] === true
                );


            case "aula-22":

                return (
                    progress.modulo04.aulas["aula-21"] === true
                );


            default:

                return false;
        }
    },


    // =========================
    // TESTE 01
    // =========================

    podeAbrirTeste01() {

        const progress = this.getProgress();

        return (
            progress.aulas["aula-01"] === true &&
            progress.aulas["aula-02"] === true &&
            progress.aulas["aula-03"] === true &&
            progress.aulas["aula-04"] === true
        );
    },


    guardarResultadoTeste01(nota) {

        const progress = this.getProgress();

        progress.teste01.nota = nota;
        progress.teste01.concluido = true;
        progress.teste01.aprovado = nota >= 80;

        this.saveProgress(progress);
    },


    teste01Aprovado() {

        const progress = this.getProgress();

        return (
            progress.teste01.aprovado === true
        );
    },


    obterProgressoModulo01() {

        const progress = this.getProgress();

        let concluidas = 0;

        if (progress.aulas["aula-01"]) {
            concluidas++;
        }

        if (progress.aulas["aula-02"]) {
            concluidas++;
        }

        if (progress.aulas["aula-03"]) {
            concluidas++;
        }

        if (progress.aulas["aula-04"]) {
            concluidas++;
        }

        if (progress.teste01.aprovado) {
            concluidas++;
        }

        return {
            concluidas: concluidas,
            total: 5,
            percentagem: Math.round(
                (concluidas / 5) * 100
            )
        };
    },


    // =========================
    // MÓDULO 02
    // =========================

    modulo02Desbloqueado() {

        return this.teste01Aprovado();
    },


    podeAbrirTeste02() {

        const progress = this.getProgress();

        const aulas = [
            "aula-05",
            "aula-06",
            "aula-07",
            "aula-08",
            "aula-09",
            "aula-10"
        ];

        return aulas.every(function(aula) {

            return (
                progress.modulo02.aulas[aula] === true
            );

        });
    },


    guardarResultadoTeste02(nota) {

        const progress = this.getProgress();

        progress.modulo02.teste.nota = nota;
        progress.modulo02.teste.concluido = true;
        progress.modulo02.teste.aprovado = nota >= 80;

        this.saveProgress(progress);
    },


    teste02Aprovado() {

        const progress = this.getProgress();

        return (
            progress.modulo02 &&
            progress.modulo02.teste &&
            progress.modulo02.teste.aprovado === true
        );
    },


    obterProgressoModulo02() {

        const progress = this.getProgress();

        let concluidas = 0;

        const aulas = [
            "aula-05",
            "aula-06",
            "aula-07",
            "aula-08",
            "aula-09",
            "aula-10"
        ];

        aulas.forEach(function(aula) {

            if (
                progress.modulo02.aulas[aula] === true
            ) {
                concluidas++;
            }

        });

        if (
            progress.modulo02.teste &&
            progress.modulo02.teste.aprovado === true
        ) {
            concluidas++;
        }

        return {
            concluidas: concluidas,
            total: 7,
            percentagem: Math.round(
                (concluidas / 7) * 100
            )
        };
    },


    // =========================
    // MÓDULO 03
    // =========================

    modulo03Desbloqueado() {

        return this.teste02Aprovado();
    },


    podeAbrirTeste03() {

        const progress = this.getProgress();

        const aulas = [
            "aula-11",
            "aula-12",
            "aula-13",
            "aula-14",
            "aula-15",
            "aula-16"
        ];

        return aulas.every(function(aula) {

            return (
                progress.modulo03.aulas[aula] === true
            );

        });
    },


    guardarResultadoTeste03(nota) {

        const progress = this.getProgress();

        progress.modulo03.teste.nota = nota;
        progress.modulo03.teste.concluido = true;
        progress.modulo03.teste.aprovado = nota >= 80;

        this.saveProgress(progress);
    },


    teste03Aprovado() {

        const progress = this.getProgress();

        return (
            progress.modulo03 &&
            progress.modulo03.teste &&
            progress.modulo03.teste.aprovado === true
        );
    },


    obterProgressoModulo03() {

        const progress = this.getProgress();

        let concluidas = 0;

        const aulas = [
            "aula-11",
            "aula-12",
            "aula-13",
            "aula-14",
            "aula-15",
            "aula-16"
        ];

        aulas.forEach(function(aula) {

            if (
                progress.modulo03.aulas[aula] === true
            ) {
                concluidas++;
            }

        });

        if (
            progress.modulo03.teste &&
            progress.modulo03.teste.aprovado === true
        ) {
            concluidas++;
        }

        return {
            concluidas: concluidas,
            total: 7,
            percentagem: Math.round(
                (concluidas / 7) * 100
            )
        };
    },


    // =========================
    // MÓDULO 04
    // =========================

    modulo04Desbloqueado() {

        return this.teste03Aprovado();
    },


    podeAbrirTeste04() {

        const progress = this.getProgress();

        const aulas = [
            "aula-17",
            "aula-18",
            "aula-19",
            "aula-20",
            "aula-21",
            "aula-22"
        ];

        return aulas.every(function(aula) {

            return (
                progress.modulo04.aulas[aula] === true
            );

        });
    },


    guardarResultadoTeste04(nota) {

        const progress = this.getProgress();

        progress.modulo04.teste.nota = nota;
        progress.modulo04.teste.concluido = true;
        progress.modulo04.teste.aprovado = nota >= 80;

        this.saveProgress(progress);
    },


    teste04Aprovado() {

        const progress = this.getProgress();

        return (
            progress.modulo04 &&
            progress.modulo04.teste &&
            progress.modulo04.teste.aprovado === true
        );
    },


    obterProgressoModulo04() {

        const progress = this.getProgress();

        let concluidas = 0;

        const aulas = [
            "aula-17",
            "aula-18",
            "aula-19",
            "aula-20",
            "aula-21",
            "aula-22"
        ];

        aulas.forEach(function(aula) {

            if (
                progress.modulo04.aulas[aula] === true
            ) {
                concluidas++;
            }

        });

        if (
            progress.modulo04.teste &&
            progress.modulo04.teste.aprovado === true
        ) {
            concluidas++;
        }

        return {
            concluidas: concluidas,
            total: 7,
            percentagem: Math.round(
                (concluidas / 7) * 100
            )
        };
    },


    // =========================
    // MÓDULO 05
    // =========================

    modulo05Desbloqueado() {

        return this.teste04Aprovado();
    },


    // =========================
    // PROGRESSO GERAL
    // =========================

    obterProgressoGeral() {

        const progress = this.getProgress();

        const modulos = [
            this.obterProgressoModulo01(),
            this.obterProgressoModulo02(),
            this.obterProgressoModulo03(),
            this.obterProgressoModulo04()
        ];

        let concluidas = 0;
        let total = 0;

        modulos.forEach(function(modulo) {

            concluidas += modulo.concluidas;
            total += modulo.total;

        });

        return {
            concluidas: concluidas,
            total: total,
            percentagem: total > 0
                ? Math.round(
                    (concluidas / total) * 100
                )
                : 0
        };
    }

};
