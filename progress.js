const VirtusCarProgress = {

    getProgress() {

        const saved = localStorage.getItem("virtuscar_progress");

        if (saved) {

            try {

                const parsed = JSON.parse(saved);

                if (!parsed.aulas) {
                    parsed.aulas = {};
                }

                if (!parsed.teste01) {
                    parsed.teste01 = {
                        concluido: false,
                        nota: 0,
                        aprovado: false
                    };
                }

                if (!parsed.modulo02) {
                    parsed.modulo02 = {
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
                    };
                }

                return parsed;

            } catch (error) {

                console.error(
                    "Erro ao carregar progresso:",
                    error
                );

            }

        }

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

            }

        };

    },


    saveProgress(progress) {

        localStorage.setItem(
            "virtuscar_progress",
            JSON.stringify(progress)
        );

    },


    concluirAula(aula) {

        const progress = this.getProgress();

        if (progress.aulas[aula] !== undefined) {

            progress.aulas[aula] = true;

        }

        if (
            progress.modulo02 &&
            progress.modulo02.aulas &&
            progress.modulo02.aulas[aula] !== undefined
        ) {

            progress.modulo02.aulas[aula] = true;

        }

        this.saveProgress(progress);

    },


    aulaConcluida(aula) {

        const progress = this.getProgress();

        if (
            progress.modulo02 &&
            progress.modulo02.aulas &&
            progress.modulo02.aulas[aula] !== undefined
        ) {

            return progress.modulo02.aulas[aula] === true;

        }

        return progress.aulas[aula] === true;

    },


    podeAbrirAula(aula) {

        const progress = this.getProgress();

        switch (aula) {

            /* =========================
               MÓDULO 01
            ========================= */

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


            /* =========================
               MÓDULO 02
            ========================= */

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


            default:

                return false;

        }

    },


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

        if (progress.aulas["aula-01"]) concluidas++;

        if (progress.aulas["aula-02"]) concluidas++;

        if (progress.aulas["aula-03"]) concluidas++;

        if (progress.aulas["aula-04"]) concluidas++;

        if (progress.teste01.aprovado) concluidas++;

        return {

            concluidas: concluidas,

            total: 5,

            percentagem:
                Math.round((concluidas / 5) * 100)

        };

    },


    modulo02Desbloqueado() {

        return this.teste01Aprovado();

    },


    concluirAulaModulo02(aula) {

        const progress = this.getProgress();

        if (
            progress.modulo02 &&
            progress.modulo02.aulas &&
            progress.modulo02.aulas[aula] !== undefined
        ) {

            progress.modulo02.aulas[aula] = true;

            this.saveProgress(progress);

        }

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
                progress.modulo02 &&
                progress.modulo02.aulas[aula] === true
            ) {

                concluidas++;

            }

        });

        if (
            progress.modulo02 &&
            progress.modulo02.teste &&
            progress.modulo02.teste.aprovado === true
        ) {

            concluidas++;

        }

        return {

            concluidas: concluidas,

            total: 7,

            percentagem:
                Math.round((concluidas / 7) * 100)

        };

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


    modulo03Desbloqueado() {

        return this.teste02Aprovado();

    }

};
